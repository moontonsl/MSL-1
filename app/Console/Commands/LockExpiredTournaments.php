<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CampusTournament;
use App\Models\CampusTournamentTeam;
use App\Models\CampusTournamentTeamMember;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LockExpiredTournaments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'teams:lock-expired-tournaments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically lock registration and fuse incomplete rosters for expired tournaments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Scanning for expired tournaments that need locking...");

        // Find approved tournaments that have passed their end_date and are not yet locked
        $expiredTournaments = CampusTournament::where('status', 'approved')
            ->where('registration_locked', false)
            ->whereDate('end_date', '<', Carbon::now())
            ->get();

        if ($expiredTournaments->isEmpty()) {
            $this->info("No expired tournaments found.");
            return 0;
        }

        foreach ($expiredTournaments as $tournament) {
            $this->info("Processing tournament: {$tournament->school_name} (ID: {$tournament->id})");
            $this->performLockAndFusion($tournament);
        }

        $this->info("All expired tournaments processed.");
        return 0;
    }

    /**
     * Core logic for locking registration and fusing rosters
     */
    protected function performLockAndFusion($tournament)
    {
        // Reload tournament with assembling teams
        $tournament->load(['teams' => function($q) {
            $q->where('status', 'assembling');
        }, 'teams.members']);

        DB::beginTransaction();
        try {
            // 1. Mark as locked
            $tournament->update(['registration_locked' => true]);

            // 2. Collect members from assembling SOLO teams and delete incomplete teams
            $assemblingTeams = $tournament->teams;
            $allMembers = [];
            foreach ($assemblingTeams as $team) {
                // Only collect players from 'solo' type teams for shuffling
                if ($team->type === 'solo') {
                    foreach ($team->members as $member) {
                        $allMembers[] = [
                            'player_id' => $member->player_id,
                            'lane_role' => $member->lane_role
                        ];
                    }
                }
                
                // All assembling teams are deleted to clear the way for fused teams
                // type=team teams that were incomplete simply lose their spot
                $team->members()->delete();
                $team->delete();
            }

            // 3. Shuffle solo members for random grouping
            shuffle($allMembers);

            // 4. Form teams of 5 from the solo pool
            $chunks = array_chunk($allMembers, 5);
            $fusedCount = 0;

            foreach ($chunks as $index => $chunk) {
                $teamName = "Fused Team " . ($index + 1) . " - " . date('md');
                
                $newTeam = CampusTournamentTeam::create([
                    'tournament_id' => $tournament->id,
                    'team_name' => $teamName,
                    'captain_id' => $chunk[0]['player_id'],
                    'status' => count($chunk) >= 5 ? 'registered' : 'assembling',
                    'type' => 'solo'
                ]);

                foreach ($chunk as $cIndex => $memberData) {
                    CampusTournamentTeamMember::create([
                        'team_id' => $newTeam->id,
                        'player_id' => $memberData['player_id'],
                        'role' => $cIndex === 0 ? 'captain' : 'member',
                        'lane_role' => $memberData['lane_role'],
                        'status' => 'accepted'
                    ]);
                }
                $fusedCount++;
            }

            DB::commit();
            $this->info("Successfully locked and fused {$fusedCount} teams for {$tournament->school_name}.");
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Failed to lock/fuse tournament {$tournament->id}: " . $e->getMessage());
            \Log::error("Scheduled Lock Error (TID: {$tournament->id}): " . $e->getMessage());
        }
    }
}
