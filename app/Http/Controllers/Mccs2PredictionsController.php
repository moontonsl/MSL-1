<?php

namespace App\Http\Controllers;

use App\Models\Mccs2Prediction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Mccs2PredictionsController extends Controller
{
    public function show(Request $request)
    {
        $mlUser = session('ml_user');
        if (!$mlUser) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Please login with your ML account first.'], 401);
            }
            return redirect()->route('ml.login')->with('error', 'Please login with your ML account first.');
        }
        $prediction = Mccs2Prediction::where('ml_id', $mlUser->ml_id)->first();
        if ($request->expectsJson()) {
            return response()->json([
                'userPrediction' => $prediction,
                'ml_user' => [
                    'ml_id' => $mlUser->ml_id,
                    'ign' => $mlUser->ign,
                    'server_id' => $mlUser->server_id
                ],
            ]);
        }
        return Inertia::render('MCC/MCCS2Predictions/index', [
            'userPrediction' => $prediction,
            'ml_user' => [
                'ml_id' => $mlUser->ml_id,
                'ign' => $mlUser->ign,
                'server_id' => $mlUser->server_id
            ],
        ]);
    }

    public function store(Request $request)
    {
        $mlUser = session('ml_user');
        if (!$mlUser) {
            return response()->json(['error' => 'Please login with your ML account first.'], 401);
        }
        // Enforce one vote per user
        if (Mccs2Prediction::where('ml_id', $mlUser->ml_id)->exists()) {
            return response()->json(['error' => 'You have already voted.'], 400);
        }
        $roles = ['GOLD', 'JUNGLER', 'EXP', 'MIDDLE', 'ROAMER'];
        $validated = $request->validate([
            'selected_teams' => 'required|array|min:1|max:2',
            'selected_teams.*.image' => 'required|string',
            'selected_teams.*.name' => 'required|string',
            'selected_players' => 'required|array',
        ]);
        foreach ($roles as $role) {
            $request->validate([
                "selected_players.$role" => 'required|array|min:1|max:3',
            ]);
        }
        $prediction = Mccs2Prediction::create([
            'ml_id' => $mlUser->ml_id,
            'selected_teams' => $request->selected_teams,
            'selected_players' => $request->selected_players,
        ]);

        // Auto-export to Google Sheets after successful vote
        try {
            $googleSheetController = new \App\Http\Controllers\GoogleSheetMCCS2Controller();
            $googleSheetController->exportMCCS2PredictionsToGoogleSheet();
        } catch (\Exception $e) {
            // Log the error but don't fail the vote submission
            \Log::error('Google Sheets export failed after vote: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Your vote has been submitted!']);
    }
} 