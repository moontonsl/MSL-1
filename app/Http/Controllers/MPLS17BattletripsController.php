<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MPLS17BattletripsController extends Controller
{
    public function index()
    {
        return Inertia::render('ExternalEvents/MPLS17BattleTrips/Pages/MPLS17Battletrips', [
            'regionTitle' => Setting::getValue('mpl_battle_trips_region', 'Open to ALL REGIONS'),
            'miniGameQuestion' => Setting::getValue('mpl_battle_trips_question', 'Which MPL PH Team has won the most championships?'),
        ]);
    }

    public function update(Request $request)
    {
        return Inertia::render('ExternalEvents/MPLS17BattleTrips/Pages/Update', [
            'currentRegion' => Setting::getValue('mpl_battle_trips_region', 'Open to ALL REGIONS'),
            'currentQuestion' => Setting::getValue('mpl_battle_trips_question', 'Which MPL PH Team has won the most championships?'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'region' => 'required|string',
            'question' => 'required|string',
        ]);

        if ($request->code !== '3054') {
            return back()->withErrors(['code' => 'Invalid access code.']);
        }

        Setting::setValue('mpl_battle_trips_region', $request->region);
        Setting::setValue('mpl_battle_trips_question', $request->question);

        return back()->with('message', 'Settings updated successfully!');
    }
}
