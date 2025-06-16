<?php

namespace App\Http\Controllers;

use App\Models\Voting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VotingController extends Controller
{
    public function index()
    {
        // Get current user's votes and voting status for each bracket
        $brackets = ['MINDANAO BRACKET', 'VISAYAS BRACKET', 'LUZON A BRACKET', 'LUZON B BRACKET'];
        $bracketStatus = [];
        $userVotes = [];
        $users_id = Auth::user();
        
        // Debug the user ID
        \Log::info('User ID in controller: ' . $users_id);

        foreach ($brackets as $bracket) {
            // Check if user has voted for this bracket
            $hasVoted = Voting::hasUserVotedForBracket(Auth::id(), $bracket);
            $bracketStatus[$bracket] = $hasVoted;

            // If user has voted, get their votes for this bracket
            if ($hasVoted) {
                $votes = Voting::getUserVotesForBracket(Auth::id(), $bracket)
                    ->map(function ($vote) {
                        return [
                            'id' => $vote->id,
                            'team' => $vote->team,
                            'image' => $vote->image,
                            'created_at' => $vote->created_at
                        ];
                    });
                $userVotes[$bracket] = $votes;
            } else {
                $userVotes[$bracket] = [];
            }
        }

        return Inertia::render('MCC/Predictions/index', [
            'userVotes' => $userVotes,
            'bracketStatus' => $bracketStatus,
            'users_id' => Auth::user()->id,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bracket' => 'required|string',
            'selectedTeams' => 'required|array|min:1|max:2',
            'selectedTeams.*.id' => 'required|integer',
            'selectedTeams.*.name' => 'required|string',
            'selectedTeams.*.image' => 'required|string'
        ]);

        // Use the new hasUserVotedForBracket method to check if user has already voted
        if (Voting::hasUserVotedForBracket(Auth::id(), $request->bracket)) {
            return back()->with('error', 'You have already voted for this bracket.');
        }

        // Create the votes
        $votes = [];
        foreach ($request->selectedTeams as $team) {
            $votes[] = Voting::create([
                'user_id' => Auth::id(),
                'bracket' => $request->bracket,
                'team' => $team['name'],
                'image' => $team['image'],
                'status' => 'open',
                'created_at' => now()
            ]);
        }

        return back()->with('success', 'Votes submitted successfully');
    }
} 