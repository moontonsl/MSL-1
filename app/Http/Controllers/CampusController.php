<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Island;
use App\Models\Region;
use App\Models\Province;

class CampusController extends Controller
{
    public function index(Request $request)
    {
        // Get all islands and provinces for the filter dropdowns
        $islands = Island::all();
        $provinces = Province::all();
        
        // Get the selected filters from request
        $selectedIslandId = $request->get('island_id');
        $selectedProvinceId = $request->get('province_id');
        
        // Build the schools query
        $schoolsQuery = School::with(['region.island', 'municipality.province']);
        
        // Filter by island if selected
        if ($selectedIslandId) {
            $schoolsQuery->whereHas('region', function($query) use ($selectedIslandId) {
                $query->where('island_id', $selectedIslandId);
            });
        }
        
        // Filter by province if selected
        if ($selectedProvinceId) {
            $schoolsQuery->whereHas('municipality', function($query) use ($selectedProvinceId) {
                $query->where('province_id', $selectedProvinceId);
            });
        }
        
        // Get paginated results (max 10 per page)
        $schools = $schoolsQuery->paginate(10);
        
        return Inertia::render('campus/index', [
            'schools' => $schools,
            'islands' => $islands,
            'provinces' => $provinces,
            'selectedIslandId' => $selectedIslandId,
            'selectedProvinceId' => $selectedProvinceId
        ]);
    }
}
