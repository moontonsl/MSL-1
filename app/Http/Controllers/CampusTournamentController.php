<?php

namespace App\Http\Controllers;

use App\Models\CampusTournament;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

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
}
