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
                return [
                    'id' => $admin->id,
                    'name' => $admin->name . ' ' . $admin->surname,
                    'email' => $admin->email,
                    'username' => $admin->username,
                    'current_region' => $admin->region, // Original single region
                    'assigned_regions' => $admin->getAssignedRegionNames(),
                ];
            });
        
        // Get all unique regions from the database with their names
        $allRegions = User::whereNotNull('region')
            ->distinct()
            ->pluck('region')
            ->filter()
            ->sort()
            ->values()
            ->map(function($regionId) {
                $region = \Illuminate\Support\Facades\DB::table('regions')->where('id', $regionId)->first();
                return $region ? $region->name : null;
            })
            ->filter()
            ->values();
        
        return Inertia::render('Admin/UserRegionManagement', [
            'regionalAdmins' => $regionalAdmins,
            'allRegions' => $allRegions,
            'user' => $user
        ]);
    }
}