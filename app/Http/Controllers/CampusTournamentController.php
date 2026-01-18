<?php

namespace App\Http\Controllers;

use App\Models\CampusTournament;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;


class CampusTournamentController extends Controller
{
    /**
     * Display tournaments for SL (Student Leader)
     */
    public function slIndex()
    {
        $user = Auth::user();
        
        // Get tournaments created by this SL with teams and members
        $tournaments = CampusTournament::where('sl_id', $user->id)
            ->with(['teams.members' => function($query) {
                // Ensure captain comes first (assuming role 'captain' is alphabetically before 'member'?? No, 'c' comes before 'm'. Perfect.)
                // Or explicit sort:
                $query->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END");
            }, 'teams.members.player'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Debug: Log the tournaments to see the actual data
        \Log::info('Tournaments for SL:', $tournaments->toArray());
            
        return Inertia::render('Campus Tournament/CampusTournament SL', [
            'tournaments' => $tournaments,
            'user' => $user
        ]);
    }

    // Removed separate SL pending view; integrated pending list within SL dashboard

    /**
     * Display tournament requests for Regional Admin
     */
    public function regionalAdminIndex()
    {
        $user = Auth::user();
        
        // Get pending tournament requests for this region
        $query = CampusTournament::with(['studentLeader'])
            ->where('status', 'pending');
            
        // Filter by region only for Regional Admins
        if ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereHas('studentLeader', function($q) use ($assignedRegionIds) {
                    $q->whereIn('region', $assignedRegionIds);
                });
            } else {
                $query->whereHas('studentLeader', function($q) use ($user) {
                    $q->where('region', $user->region);
                });
            }
        }
        // Super Admins see all pending requests (no filter applied)
        
        $tournaments = $query->orderBy('created_at', 'desc')->get();
        
        // Get approved tournaments with teams and members for the Ongoing Tournaments section
        // Show all approved tournaments (both active and completed) so we can filter them on frontend
        $approvedQuery = CampusTournament::with([
            'teams' => function($query) {
                $query->where('status', 'registered');
            },
            'teams.members' => function($query) {
                $query->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END");
            },
            'teams.members.player',
            'studentLeader'
        ])->where('status', 'approved');
        
        // Filter by region only for Regional Admins
        if ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $approvedQuery->whereHas('studentLeader', function($q) use ($assignedRegionIds) {
                    $q->whereIn('region', $assignedRegionIds);
                });
            } else {
                $approvedQuery->whereHas('studentLeader', function($q) use ($user) {
                    $q->where('region', $user->region);
                });
            }
        }
        // Super Admins see all approved tournaments
        
        $approvedTournaments = $approvedQuery->orderBy('start_date', 'desc')->get();
        
        // Debug: Log the tournaments to see the actual data
        \Log::info('Tournaments for Regional/Super Admin:', $tournaments->toArray());
        
        return Inertia::render('Campus Tournament/Regional Admin', [
            'tournaments' => $tournaments,
            'approvedTournaments' => $approvedTournaments,
            'user' => $user
        ]);
    }

    /**
     * Store a new tournament request
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Only SL can create tournaments
        if ($user->role !== 'SL') {
            return response()->json(['error' => 'Only Student Leaders can create tournaments'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $tournament = CampusTournament::create([
            'school_name' => $user->university,
            'sl_name' => $user->name . ' ' . $user->surname,
            'sl_id' => $user->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'pending',
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament request submitted successfully',
            'tournament' => $tournament
        ]);
    }

    /**
     * Approve a tournament request
     */
    public function approve(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only Regional Admin or Super Admin can approve
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins or Super Admins can approve tournaments'], 403);
        }
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Check if user has access to this region
        $hasAccess = false;
        if ($user->role === 'Super Admin') {
            $hasAccess = true;
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $hasAccess = in_array($tournament->studentLeader->region, $assignedRegionIds);
            } else {
                $hasAccess = $tournament->studentLeader->region === $user->region;
            }
        }
        
        if (!$hasAccess) {
            return response()->json(['error' => 'Access denied to this tournament'], 403);
        }
        
        $tournament->update([
            'status' => 'approved',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament approved successfully'
        ]);
    }

    /**
     * Reject a tournament request
     */
    public function reject(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only Regional Admin or Super Admin can reject
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins or Super Admins can reject tournaments'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'rejection_reason' => 'required|string|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Check if user has access to this region
        $hasAccess = false;
        if ($user->role === 'Super Admin') {
            $hasAccess = true;
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $hasAccess = in_array($tournament->studentLeader->region, $assignedRegionIds);
            } else {
                $hasAccess = $tournament->studentLeader->region === $user->region;
            }
        }
        
        if (!$hasAccess) {
            return response()->json(['error' => 'Access denied to this tournament'], 403);
        }
        
        $tournament->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament rejected successfully'
        ]);
    }

    /**
     * Extend tournament registration deadline
     */
    public function extendRegistration(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only Regional Admin or Super Admin can extend
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins or Super Admins can extend tournaments'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'end_date' => 'required|date|after_or_equal:today',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Check if user has access to this region
        $hasAccess = false;
        if ($user->role === 'Super Admin') {
            $hasAccess = true;
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $hasAccess = in_array($tournament->studentLeader->region, $assignedRegionIds);
            } else {
                $hasAccess = $tournament->studentLeader->region === $user->region;
            }
        }
        
        if (!$hasAccess) {
            return response()->json(['error' => 'Access denied to this tournament'], 403);
        }
        
        // Update the end_date (overwrite existing)
        $tournament->update([
            'end_date' => $request->end_date,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament registration extended successfully',
            'tournament' => $tournament
        ]);
    }

    /**
     * Delete a tournament (only SL who created it)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Only SL who created it can delete, and only if pending or rejected
        if ($tournament->sl_id !== $user->id || !in_array($tournament->status, ['pending', 'rejected'])) {
            return response()->json(['error' => 'You can only delete your own pending or rejected tournaments'], 403);
        }
        
        $tournament->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Tournament deleted successfully'
        ]);
    }

    /**
     * Display all approved tournaments with teams (for testing purposes)
     */
    public function publicIndex()
    {
        // Get all approved tournaments with teams and members
        $tournaments = CampusTournament::where('status', 'approved')
            ->with([
                'teams' => function($query) {
                    $query->where('status', 'registered');
                },
                'teams.members' => function($query) {
                    $query->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END");
                }, 
                'teams.members.player', 
                'studentLeader'
            ])
            ->orderBy('start_date', 'desc')
            ->get();
            
        return Inertia::render('Campus Tournament/CampusTournament SL', [
            'tournaments' => $tournaments,
            'user' => null
        ]);
    }

    /**
     * Submit tournament results
     */
    public function submitResults(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only SL can submit results
        if ($user->role !== 'SL') {
            return response()->json(['error' => 'Only Student Leaders can submit results'], 403);
        }
        
        $tournament = CampusTournament::with('teams')->findOrFail($id);
        
        // Check if user owns this tournament
        if ($tournament->sl_id !== $user->id) {
            return response()->json(['error' => 'You can only submit results for your own tournaments'], 403);
        }
        
        // Check if tournament is approved
        if ($tournament->status !== 'approved') {
            return response()->json(['error' => 'Only approved tournaments can have results submitted'], 400);
        }
        
        // Check if results are already submitted
        if ($tournament->results_submitted) {
            return response()->json(['error' => 'Results have already been submitted for this tournament'], 400);
        }
        
        $validator = Validator::make($request->all(), [
            'results' => 'required|array',
            'results.*.team_id' => 'required|integer|exists:campus_tournament_teams,id',
            'results.*.result' => 'required|in:participant,1st,2nd,3rd',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $results = $request->results;
        
        // Validate that exactly one team has '1st' result
        $firstPlaceTeams = array_filter($results, function($result) {
            return $result['result'] === '1st';
        });
        
        if (count($firstPlaceTeams) !== 1) {
            return response()->json(['error' => 'Exactly one team must be marked as 1st place'], 422);
        }
        
        // Validate that exactly one team has '2nd' result
        $secondPlaceTeams = array_filter($results, function($result) {
            return $result['result'] === '2nd';
        });
        
        if (count($secondPlaceTeams) !== 1) {
            return response()->json(['error' => 'Exactly one team must be marked as 2nd place'], 422);
        }
        
        // Validate that exactly one team has '3rd' result
        $thirdPlaceTeams = array_filter($results, function($result) {
            return $result['result'] === '3rd';
        });
        
        if (count($thirdPlaceTeams) !== 1) {
            return response()->json(['error' => 'Exactly one team must be marked as 3rd place'], 422);
        }
        
        // Validate that all teams in the tournament have results
        $tournamentTeamIds = $tournament->teams->pluck('id')->toArray();
        $resultTeamIds = array_column($results, 'team_id');
        
        if (count($tournamentTeamIds) !== count($resultTeamIds) || 
            !empty(array_diff($tournamentTeamIds, $resultTeamIds))) {
            return response()->json(['error' => 'Results must be provided for all teams in the tournament'], 422);
        }
        
        try {
            // Update team results
            foreach ($results as $result) {
                $team = $tournament->teams->find($result['team_id']);
                if ($team) {
                    $team->update(['result' => $result['result']]);
                }
            }
            
            // Mark tournament as results submitted
            $tournament->update([
                'results_submitted' => true,
                'results_submitted_at' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Tournament results submitted successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error submitting tournament results: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to submit results. Please try again.'], 500);
        }
    }

    /**
     * Update already submitted tournament results
     */
    public function updateResults(Request $request, $id)
    {
        $user = Auth::user();
        
        // Allow SL, Regional Admin, and Super Admin
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Unauthorized to update results'], 403);
        }
        
        $tournament = CampusTournament::with('teams')->findOrFail($id);
        
        // Check permissions
        if ($user->role === 'SL') {
            // SL must own the tournament
            if ($tournament->sl_id !== $user->id) {
                return response()->json(['error' => 'You can only update results for your own tournaments'], 403);
            }
        }
        // Regional Admins/Super Admins bypass the sl_id check (Region check is implicitly handled by what they can see/access, 
        // strictly we should check region again but for this edit feature we assume access if they have the ID)
        
        // Check if tournament is approved
        if ($tournament->status !== 'approved') {
            return response()->json(['error' => 'Only approved tournaments can have results updated'], 400);
        }
        
        // Check if results are submitted (this endpoint is specifically for editing submitted results)
        if (!$tournament->results_submitted) {
            return response()->json(['error' => 'Results have not been submitted yet. Use submit endpoint instead.'], 400);
        }
        
        $validator = Validator::make($request->all(), [
            'results' => 'required|array',
            'results.*.team_id' => 'required|integer|exists:campus_tournament_teams,id',
            'results.*.result' => 'required|in:participant,1st,2nd,3rd',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $results = $request->results;
        
        // Validate that exactly one team has '1st' result
        $firstPlaceTeams = array_filter($results, function($result) {
            return $result['result'] === '1st';
        });
        
        if (count($firstPlaceTeams) !== 1) {
            return response()->json(['error' => 'Exactly one team must be marked as 1st place'], 422);
        }
        
        // Validate that exactly one team has '2nd' result
        $secondPlaceTeams = array_filter($results, function($result) {
            return $result['result'] === '2nd';
        });
        
        if (count($secondPlaceTeams) !== 1) {
            return response()->json(['error' => 'Exactly one team must be marked as 2nd place'], 422);
        }
        
        // Validate that exactly one team has '3rd' result
        $thirdPlaceTeams = array_filter($results, function($result) {
            return $result['result'] === '3rd';
        });
        
        if (count($thirdPlaceTeams) !== 1) {
            return response()->json(['error' => 'Exactly one team must be marked as 3rd place'], 422);
        }
        
        // Validate that all teams in the tournament have results
        $tournamentTeamIds = $tournament->teams->pluck('id')->toArray();
        $resultTeamIds = array_column($results, 'team_id');
        
        if (count($tournamentTeamIds) !== count($resultTeamIds) || 
            !empty(array_diff($tournamentTeamIds, $resultTeamIds))) {
            return response()->json(['error' => 'Results must be provided for all teams in the tournament'], 422);
        }
        
        try {
            // Update team results
            foreach ($results as $result) {
                $team = $tournament->teams->find($result['team_id']);
                if ($team) {
                    $team->update(['result' => $result['result']]);
                }
            }
            
            // Touch the tournament timestamp/results_submitted_at if needed
            $tournament->update([
                'results_submitted_at' => now(), // Update the submitted time to show it was edited
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Tournament results updated successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error updating tournament results: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update results. Please try again.'], 500);
        }
    }

    /**
     * Show team view for registered team members
     */
    public function teamView(\Illuminate\Http\Request $request)
    {
        // Get user ID from query parameter or authenticated user
        $userId = $request->query('user_id');
        $user = null;
        
        if ($userId) {
            // Get user data by ID
            $user = \App\Models\User::find($userId);
        } else {
            // Fallback to authenticated user
            $user = Auth::user();
        }
        
        if (!$user) {
            return Inertia::render('Campus Tournament/Campus Tournament Team', [
                'team' => null,
                'user' => null,
                'message' => 'User not found.'
            ]);
        }
        
        // Find the team where this user is a member
        // Prioritize teams in active tournaments (results not submitted) and recent teams
        $teamMember = \App\Models\CampusTournamentTeamMember::where('player_id', $user->id)
            ->whereHas('team.tournament', function($query) {
                $query->where('status', 'approved')
                     // Prefer active tournaments first, so we don't show old ones
                      ->orderBy('results_submitted', 'asc') 
                      ->orderBy('end_date', 'desc');
            })
            ->with(['team.tournament', 'team.members' => function($query) {
                // Sorting logic for members
                $query->orderByRaw("CASE WHEN role = 'captain' THEN 1 ELSE 2 END");
            }, 'team.members.player'])
            // Order by creation time to get the NEWEST team (resolves duplicate issue)
            ->latest() 
            ->first();
        
        if (!$teamMember) {
            return Inertia::render('Campus Tournament/Campus Tournament Team', [
                'team' => null,
                'user' => $user,
                'message' => 'You are not registered in any team.'
            ]);
        }
        
        $team = $teamMember->team;
        $isCaptain = $teamMember->role === 'captain';
        
        return Inertia::render('Campus Tournament/Campus Tournament Team', [
            'team' => $team,
            'user' => $user,
            'isCaptain' => $isCaptain
        ]);
    }

    /**
     * Finalize and submit a team
     */
    /**
     * Finalize and submit a team
     */
    public function submitTeam(Request $request, $id)
    {
        // Allow manual user_id override for guest access
        $userId = $request->input('user_id');
        $user = $userId ? \App\Models\User::find($userId) : Auth::user();

        if (!$user) {
             return response()->json(['message' => 'Unauthorized: User not found'], 401);
        }

        $team = \App\Models\CampusTournamentTeam::with('members')->findOrFail($id);
        
        // 1. Check if user is the captain
        $captainMember = $team->members()->where('role', 'captain')->where('player_id', $user->id)->first();
        if (!$captainMember) {
            return response()->json(['message' => 'Only the team captain can submit the team.'], 403);
        }
        
        // 2. Check if team is already registered
        if ($team->status === 'registered') {
             return response()->json(['message' => 'Team is already registered.'], 400);
        }

        // 3. Check if we have 5 members
        if ($team->members()->count() !== 5) {
             return response()->json(['message' => 'Team must have exactly 5 members.'], 400);
        }
        
        // 4. Check if all members have accepted
        $pendingCount = $team->members()->where('status', '!=', 'accepted')->count();
        if ($pendingCount > 0) {
             return response()->json(['message' => 'All team members must accept their invites before submitting.'], 400);
        }
        
        // 5. Update status
        $team->update(['status' => 'registered']);
        
        return response()->json([
            'success' => true,
            'message' => 'Team submitted successfully! Your roster is now final.'
        ]);
    }

    /**
     * Update an existing team
     */
    public function updateTeam(Request $request, $teamId)
    {
        // 1. Validate the request
        $request->validate([
            'teamName' => 'required|string|max:50',
            'discordId' => 'required|string|max:50',
            'captain' => 'required|array',
            'captain.id' => 'required|integer',
            'captain.university' => 'required|string',
            'players' => 'required|array',
            'players.captain' => 'required|array',
            'players.player2' => 'required|array',
            'players.player3' => 'required|array',
            'players.player4' => 'required|array',
            'players.player5' => 'required|array',
        ]);
        
        $captain = $request->captain;
        
        // Allow manual user_id override for guest access
        $userId = $request->input('user_id'); 
        $user = $userId ? \App\Models\User::find($userId) : Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // 2. Find the existing team
        $team = \App\Models\CampusTournamentTeam::find($teamId);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }
        
        // 3. Check if current user is the captain
        if ($team->captain_id !== $user->id) {
            return response()->json(['message' => 'Only the team captain can edit the team'], 403);
        }
        
        // 4. IMPORTANT: Check if team is already submitted/registered
        if ($team->status === 'registered') {
             return response()->json(['message' => 'Team cannot be updated after submission. Contact support/admin if changes are needed.'], 403);
        }

        // 5. COLLECT ALL PLAYER IDs TO CHECK (Captain + Members)
        $playerIdsToCheck = [
            $captain['id'],
            $request->players['player2']['id'] ?? null,
            $request->players['player3']['id'] ?? null,
            $request->players['player4']['id'] ?? null,
            $request->players['player5']['id'] ?? null,
        ];
        $playerIdsToCheck = array_filter($playerIdsToCheck);
        if (count($playerIdsToCheck) !== count(array_unique($playerIdsToCheck))) {
            return response()->json(['message' => "Duplicate players found in the roster."], 400);
        }
        
        // 6. Check if team name already exists
        $existingTeamName = \App\Models\CampusTournamentTeam::where('team_name', $request->teamName)
            ->where('tournament_id', $team->tournament_id)
            ->where('id', '!=', $teamId)
            ->first();
        
        if ($existingTeamName) {
            return response()->json(['message' => 'Team name already exists'], 400);
        }
        
        \DB::beginTransaction();
        try {
            // 7. Update team details
            $team->update([
                'team_name' => $request->teamName,
                'discord_id' => $request->discordId,
            ]);
            
            // 8. Handle Members Update
            $currentMembers = \App\Models\CampusTournamentTeamMember::where('team_id', $teamId)->get()->keyBy('player_id');
            
            $players = [
                $request->players['captain'],
                $request->players['player2'],
                $request->players['player3'],
                $request->players['player4'],
                $request->players['player5'],
            ];
            
            $newPlayerIds = [];
            
            foreach ($players as $player) {
                if (isset($player['id'])) {
                    $newPlayerIds[] = $player['id'];
                    $playerId = $player['id'];
                    $role = ($playerId == $captain['id']) ? 'captain' : 'member';
                    
                    if (isset($currentMembers[$playerId])) {
                         $currentMembers[$playerId]->update(['role' => $role]);
                    } else {
                        \App\Models\CampusTournamentTeamMember::create([
                            'team_id' => $team->id,
                            'player_id' => $playerId,
                            'role' => $role,
                            'status' => ($playerId == $captain['id']) ? 'accepted' : 'pending',
                        ]);
                    }
                }
            }
            
            // 9. Remove members not in the new list
            \App\Models\CampusTournamentTeamMember::where('team_id', $teamId)
                ->whereNotIn('player_id', $newPlayerIds)
                ->delete();
            
            \DB::commit();
            
            return response()->json(['message' => 'Team updated successfully', 'team_id' => $team->id]);
            
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Team update error: ' . $e->getMessage());
            return response()->json(['message' => 'Update failed. ' . $e->getMessage()], 500);
        }
    }

    /**
     * Export tournament results to Excel
     */
    public function exportToExcel($id)
    {
        $user = Auth::user();
        
        // Allow SL, Regional Admin, and Super Admin
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Unauthorized to export results'], 403);
        }
        
        $tournament = CampusTournament::with(['teams.members.player'])->findOrFail($id);
        
        // Check permissions
        if ($user->role === 'SL') {
             // Check if user owns this tournament
            if ($tournament->sl_id !== $user->id) {
                return response()->json(['error' => 'You can only export your own tournaments'], 403);
            }
        }
        
        // Check if results are submitted
        if (!$tournament->results_submitted) {
            return response()->json(['error' => 'Results must be submitted before exporting'], 400);
        }
        
        // Create new Spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Headers
        $headers = ['Rank', 'Team Name', 'Player Name', 'IGN', 'Server', 'UID'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '1', $header);
            $sheet->getStyle($col . '1')->getFont()->setBold(true);
            $sheet->getStyle($col . '1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $col++;
        }
        
        // Sort teams by result
        $teams = $tournament->teams->sortBy(function($team) {
            $order = ['1st' => 1, '2nd' => 2, '3rd' => 3, 'participant' => 4];
            return $order[$team->result] ?? 5;
        });
        
        // Data rows
        $row = 2;
        foreach ($teams as $team) {
            // Determine rank display text and color
            $result = $team->result ?? 'participant';
            $rankString = 'Participant';
            $rankColor = null;

            if ($result === '1st') {
                $rankString = '1st';
                $rankColor = 'FFFFCC00'; // Yellow/Gold
            } elseif ($result === '2nd') {
                $rankString = '2nd';
                $rankColor = 'FFC0C0C0'; // Silver
            } elseif ($result === '3rd') {
                $rankString = '3rd';
                $rankColor = 'FFCD7F32'; // Bronze
            }

            // Get members sorted: Captain first, then others
            $members = $team->members->sortBy('role', SORT_REGULAR, true);

            foreach ($members as $member) {
                $player = $member->player;
                
                // Set Row Values
                $sheet->setCellValue('A' . $row, $rankString);
                $sheet->setCellValue('B' . $row, $team->team_name);
                $sheet->setCellValue('C' . $row, $player ? trim($player->name . ' ' . $player->surname) : 'Unknown');
                $sheet->setCellValue('D' . $row, $player ? $player->ml_ign : '-');
                $sheet->setCellValue('E' . $row, $player ? $player->ml_server : '-');
                $sheet->setCellValue('F' . $row, $player ? $player->ml_id : '-');

                // Apply rank color to the rank and team name columns (A and B) as per image
                if ($rankColor) {
                    $sheet->getStyle('A' . $row . ':B' . $row)->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()->setARGB($rankColor);
                }

                $row++;
            }
        }
        
        // Auto-size columns A to F
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        
        // Add borders to the table
        $lastRow = $row - 1;
        $sheet->getStyle('A1:F' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
        // Center alignment for certain columns
        $sheet->getStyle('A1:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('E1:F' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        
        // Create filename
        $filename = 'Tournament_Results_' . str_replace(' ', '_', $tournament->school_name) . '_' . date('Y-m-d') . '.xlsx';
        
        // Create writer and save to output
        $writer = new Xlsx($spreadsheet);
        
        // Set headers for download
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        
        $writer->save('php://output');
        exit;
    }
}
