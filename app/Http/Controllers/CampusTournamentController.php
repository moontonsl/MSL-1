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
            ->with(['teams.members.player'])
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
        
        $tournaments = $query->orderBy('created_at', 'desc')->get();
        
        // Get approved tournaments with teams and members for the Ongoing Tournaments section
        // Only show tournaments that are active (results not submitted)
        $approvedQuery = CampusTournament::with([
            'teams.members.player',
            'studentLeader'
        ])->where('status', 'approved')
          ->where('results_submitted', false);
        
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
        
        $approvedTournaments = $approvedQuery->orderBy('start_date', 'desc')->get();
        
        // Debug: Log the tournaments to see the actual data
        \Log::info('Tournaments for Regional Admin:', $tournaments->toArray());
        \Log::info('Approved Tournaments for Regional Admin:', $approvedTournaments->toArray());
        
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
        
        // Only Regional Admin can approve
        if ($user->role !== 'Regional Admin') {
            return response()->json(['error' => 'Only Regional Admins can approve tournaments'], 403);
        }
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Check if user has access to this region
        $hasAccess = false;
        if ($user->role === 'Regional Admin') {
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
        
        // Only Regional Admin can reject
        if ($user->role !== 'Regional Admin') {
            return response()->json(['error' => 'Only Regional Admins can reject tournaments'], 403);
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
        if ($user->role === 'Regional Admin') {
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
     * Delete a tournament (only SL who created it)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $tournament = CampusTournament::findOrFail($id);
        
        // Only SL who created it can delete, and only if pending
        if ($tournament->sl_id !== $user->id || $tournament->status !== 'pending') {
            return response()->json(['error' => 'You can only delete your own pending tournaments'], 403);
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
            ->with(['teams.members.player', 'studentLeader'])
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
        $teamMember = \App\Models\CampusTournamentTeamMember::where('player_id', $user->id)
            ->with(['team.tournament', 'team.members.player'])
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
     * Export tournament results to Excel
     */
    public function exportToExcel($id)
    {
        $user = Auth::user();
        
        // Only SL can export their own tournaments
        if ($user->role !== 'SL') {
            return response()->json(['error' => 'Only Student Leaders can export tournament results'], 403);
        }
        
        $tournament = CampusTournament::with(['teams.members.player'])->findOrFail($id);
        
        // Check if user owns this tournament
        if ($tournament->sl_id !== $user->id) {
            return response()->json(['error' => 'You can only export your own tournaments'], 403);
        }
        
        // Check if results are submitted
        if (!$tournament->results_submitted) {
            return response()->json(['error' => 'Results must be submitted before exporting'], 400);
        }
        
        // Create new Spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Set document properties
        $spreadsheet->getProperties()
            ->setCreator('MSL Campus Tournament')
            ->setTitle('Tournament Results - ' . $tournament->school_name)
            ->setSubject('Tournament Results')
            ->setDescription('Campus Tournament Results Export');
        
        // Title
        $sheet->setCellValue('A1', strtoupper($tournament->school_name) . ' TOURNAMENT RESULTS');
        $sheet->mergeCells('A1:V1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        
        // Tournament Information
        $row = 3;
        $sheet->setCellValue('A' . $row, 'Registration Start Date:');
        $sheet->setCellValue('B' . $row, $tournament->start_date->format('F d, Y'));
        $sheet->getStyle('A' . $row)->getFont()->setBold(true);
        
        $row++;
        $sheet->setCellValue('A' . $row, 'Registration End Date:');
        $sheet->setCellValue('B' . $row, $tournament->end_date->format('F d, Y'));
        $sheet->getStyle('A' . $row)->getFont()->setBold(true);
        
        $row++;
        $sheet->setCellValue('A' . $row, 'Results Submitted:');
        $sheet->setCellValue('B' . $row, $tournament->results_submitted_at->format('F d, Y h:i A'));
        $sheet->getStyle('A' . $row)->getFont()->setBold(true);
        
        // Add spacing
        $row += 2;
        
        // Headers - Main columns
        $mainHeaders = ['Rank', 'Team Name'];
        $col = 'A';
        foreach ($mainHeaders as $header) {
            $sheet->setCellValue($col . $row, $header);
            $sheet->getStyle($col . $row)->getFont()->setBold(true);
            $sheet->getStyle($col . $row)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FFD3D3D3');
            $sheet->getStyle($col . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $col++;
        }
        
        // Headers - Player columns (Name, IGN, ID, Server for each of 5 players)
        for ($i = 1; $i <= 5; $i++) {
            $playerHeaders = [
                "Player $i Name",
                "Player $i IGN",
                "Player $i ID",
                "Player $i Server"
            ];
            foreach ($playerHeaders as $header) {
                $sheet->setCellValue($col . $row, $header);
                $sheet->getStyle($col . $row)->getFont()->setBold(true);
                $sheet->getStyle($col . $row)->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFD3D3D3');
                $sheet->getStyle($col . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $col++;
            }
        }
        
        // Sort teams by result
        $teams = $tournament->teams->sortBy(function($team) {
            $order = ['1st' => 1, '2nd' => 2, '3rd' => 3, 'participant' => 4];
            return $order[$team->result] ?? 5;
        });
        
        // Data rows
        $row++;
        foreach ($teams as $team) {
            // Determine rank display text
            $result = $team->result ?? 'participant';
            if ($result === 'participant') {
                $rank = 'Participant';
            } elseif ($result === '1st') {
                $rank = '1st';
            } elseif ($result === '2nd') {
                $rank = '2nd';
            } elseif ($result === '3rd') {
                $rank = '3rd';
            } else {
                $rank = 'Participant';
            }
            
            $sheet->setCellValue('A' . $row, $rank);
            $sheet->setCellValue('B' . $row, $team->team_name);
            
            // Add player data (Name, IGN, ID, Server for each player)
            $players = $team->members->sortBy('role', SORT_REGULAR, true); // Captain first
            $playerCol = 'C';
            $columnIndex = 2; // Starting from column C (0=A, 1=B, 2=C)
            
            foreach ($players->take(5) as $member) {
                $player = $member->player;
                
                // Player Name
                $playerName = $player ? trim($player->name . ' ' . $player->surname) : 'Unknown';
                $sheet->setCellValue($playerCol . $row, $playerName);
                $playerCol++;
                $columnIndex++;
                
                // ML IGN - clean and validate
                $mlIgn = '-';
                if ($player && !empty($player->ml_ign)) {
                    $mlIgn = trim($player->ml_ign);
                    // Limit length to prevent display issues
                    if (strlen($mlIgn) > 50) {
                        $mlIgn = substr($mlIgn, 0, 50);
                    }
                }
                $sheet->setCellValue($playerCol . $row, $mlIgn);
                $playerCol++;
                $columnIndex++;
                
                // ML ID - clean and validate
                $mlId = '-';
                if ($player && !empty($player->ml_id)) {
                    $mlId = trim($player->ml_id);
                }
                $sheet->setCellValue($playerCol . $row, $mlId);
                $playerCol++;
                $columnIndex++;
                
                // ML Server - clean and validate
                $mlServer = '-';
                if ($player && !empty($player->ml_server)) {
                    $mlServer = trim($player->ml_server);
                }
                $sheet->setCellValue($playerCol . $row, $mlServer);
                $playerCol++;
                $columnIndex++;
            }
            
            // Color code ranks - apply to entire row for better visibility
            if ($result === '1st') {
                $sheet->getStyle('A' . $row)->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFFFD700'); // Gold
            } elseif ($result === '2nd') {
                $sheet->getStyle('A' . $row)->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFC0C0C0'); // Silver
            } elseif ($result === '3rd') {
                $sheet->getStyle('A' . $row)->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFCD7F32'); // Bronze
            }
            
            $row++;
        }
        
        // Auto-size columns (A to V = 22 columns: Rank, Team + 5 players × 4 fields)
        foreach (range('A', 'V') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        
        // Disable text wrapping for all data cells to prevent display issues
        $sheet->getStyle('A7:V' . ($row - 1))->getAlignment()->setWrapText(false);
        
        // Add borders to the table
        $lastRow = $row - 1;
        $sheet->getStyle('A7:V' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
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
