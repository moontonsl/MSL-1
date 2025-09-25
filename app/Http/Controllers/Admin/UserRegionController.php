<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserRegionController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Check if user is Admin or Super Admin
        if ($user->role !== 'Admin' && $user->role !== 'Super Admin') {
            return redirect()->route('dashboard')->with('error', 'Access denied. Only Admins can access this page.');
        }
        
        // Get all Regional Admin users with their assigned regions
        $regionalAdmins = User::where('role', 'Regional Admin')
            ->with('assignedRegions')
            ->get()
            ->map(function ($admin) {
                // Convert region ID to region name
                $currentRegionName = null;
                if ($admin->region) {
                    $region = \Illuminate\Support\Facades\DB::table('regions')->where('id', $admin->region)->first();
                    $currentRegionName = $region ? $region->name : null;
                }
                
                return [
                    'id' => $admin->id,
                    'name' => $admin->name . ' ' . $admin->surname,
                    'email' => $admin->email,
                    'username' => $admin->username,
                    'current_region' => $currentRegionName, // Converted to region name
                    'assigned_regions' => $admin->getAssignedRegionNames(), // Now includes original region
                ];
            });
        
        // Get all regions directly from the regions table
        $allRegions = \Illuminate\Support\Facades\DB::table('regions')
            ->orderBy('name')
            ->pluck('name')
            ->values();
        
        // Get regions that are already assigned to Regional Admins
        $assignedRegions = \App\Models\UserRegion::with('user')
            ->get()
            ->map(function($userRegion) {
                return [
                    'region_name' => $userRegion->region_name,
                    'assigned_to' => $userRegion->user->name . ' ' . $userRegion->user->surname,
                    'user_id' => $userRegion->user_id
                ];
            })
            ->groupBy('region_name')
            ->map(function($assignments) {
                return $assignments->first(); // Get the first assignment for each region
            });
        
        // Get list of Regional Admins for re-assignment dropdown
        $regionalAdminsList = User::where('role', 'Regional Admin')
            ->get(['id', 'name', 'surname'])
            ->map(function ($admin) {
                return [
                    'id' => $admin->id,
                    'name' => $admin->name . ' ' . $admin->surname
                ];
            });

        return Inertia::render('Admin/UserRegionManagement', [
            'regionalAdmins' => $regionalAdmins,
            'allRegions' => $allRegions,
            'assignedRegions' => $assignedRegions,
            'regionalAdminsList' => $regionalAdminsList,
            'user' => $user
        ]);
    }
}