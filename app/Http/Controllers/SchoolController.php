<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\School;

class SchoolController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->query('query');

        if (!$query) {
            return response()->json([]);
        }

        $schools = School::with('region.island')
                ->where('name', 'like', '%' . $query . '%')
                ->select('id', 'name', 'region_id')
                ->limit(10)
                ->get();

        $formatted = $schools->map(function ($school) {
            return [
                'id' => $school->id,
                'name' => $school->name,
                'island' => $school->region->island->name ?? '',
                'region' => $school->region->name ?? '',
            ];
        });
                

        return response()->json($formatted);
    }

}
