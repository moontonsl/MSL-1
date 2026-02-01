<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function create()
    {
        if (!auth()->check() || !in_array(auth()->user()->role, ['Regional Admin', 'Super Admin'])) {
            return redirect('/');
        }

        $islands = \App\Models\Island::orderBy('name')->get(['id', 'name']);
        // Also fetch regions for the add school modal
        $regions = \App\Models\Region::orderBy('name')->get(['id', 'name']);
        
        return \Inertia\Inertia::render('Community/Create', [
            'islands' => $islands,
            'regions' => $regions,
            'mapLocations' => \App\Models\MapLocation::orderBy('name')->get(['code', 'name']),
        ]);
    }

    public function getSchoolsByIsland(Request $request)
    {
        $islandId = $request->query('island_id');
        
        $schools = \App\Models\School::with(['municipality', 'region'])
            ->whereHas('region.island', function ($query) use ($islandId) {
                $query->where('id', $islandId);
            })
            ->orderBy('name')
            ->get(['id', 'name', 'municipality_id', 'region_id']);

        // Format to include municipality name for the frontend auto-fill
        $formatted = $schools->map(function ($school) {
            return [
                'id' => $school->id,
                'name' => $school->name,
                'location' => $school->municipality->name ?? '',
                'island' => $school->region->island->name ?? '',
            ];
        });

        return response()->json($formatted);
    }
    
    // For Add New School Modal
    public function getProvincesByRegion(Request $request) {
        $regionId = $request->query('region_id');
        
        // Since provinces table doesn't have region_id, we need to find provinces
        // through municipalities that belong to schools in this region
        $provinces = \App\Models\Province::whereHas('municipalities.schools', function($query) use ($regionId) {
            $query->where('region_id', $regionId);
        })
        ->distinct()
        ->orderBy('name')
        ->get(['id', 'name']);
        
        return response()->json($provinces);
    }

    public function getMunicipalitiesByProvince(Request $request) {
        $provinceId = $request->query('province_id');
        $municipalities = \App\Models\Municipality::where('province_id', $provinceId)->orderBy('name')->get(['id', 'name']);
        return response()->json($municipalities);
    }

    public function store(Request $request)
    {
        if (!auth()->check() || !in_array(auth()->user()->role, ['Regional Admin', 'Super Admin'])) {
            return redirect('/');
        }

        $request->validate([
            // School data
            'school_id' => 'required_without:new_school_name', // or handled by logic
            // Community data
            'map_code' => 'required',
            'school_link' => 'required|url',
        ]);

        $schoolId = $request->school_id;

        // Create New School if requested
        if ($request->boolean('is_new_school')) {
            $request->validate([
                'new_school_name' => 'required|string|max:255|unique:schools,name',
                'region_id' => 'required|exists:regions,id',
                'municipality_id' => 'required|exists:municipalities,id',
            ]);

            $school = \App\Models\School::create([
                'name' => $request->new_school_name,
                'region_id' => $request->region_id,
                'municipality_id' => $request->municipality_id,
            ]);
            $schoolId = $school->id;
        }

        $school = \App\Models\School::with('municipality', 'region.island')->findOrFail($schoolId);
        
        // Create Community
        \App\Models\Community::create([
            'school_id' => $schoolId,
            'location' => $school->municipality->name ?? 'Unknown',
            'island' => $school->region->island->name ?? 'Unknown',
            'map_code' => $request->map_code,
            'school_link' => $request->school_link,
        ]);

        return redirect()->back()->with('success', 'Community added successfully!');
    }
}
