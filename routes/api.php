<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

// Test route to check if API is working
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// API endpoints for managing user regions (Admin only)
Route::middleware(['web'])->group(function () {
    Route::get('/admin/users/{userId}/regions', function ($userId) {
        // Custom authentication check
        if (!Auth::check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        $user = Auth::user();
        if ($user->role !== 'Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Admins can manage user regions.'], 403);
        }
        
        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json(['error' => 'User not found.'], 404);
        }
        
        $assignedRegions = $targetUser->getAssignedRegionNames();
        
        return response()->json([
            'user_id' => $targetUser->id,
            'user_name' => $targetUser->name . ' ' . $targetUser->surname,
            'user_role' => $targetUser->role,
            'assigned_regions' => $assignedRegions
        ]);
    });
    
    Route::post('/admin/users/{userId}/regions', function ($userId, Request $request) {
        \Log::info('API Route hit', [
            'userId' => $userId, 
            'requestData' => $request->all(),
            'regions' => $request->input('regions'),
            'regionsType' => gettype($request->input('regions')),
            'regionsCount' => is_array($request->input('regions')) ? count($request->input('regions')) : 'not array',
            'firstRegion' => is_array($request->input('regions')) && count($request->input('regions')) > 0 ? $request->input('regions')[0] : 'no regions',
            'firstRegionType' => is_array($request->input('regions')) && count($request->input('regions')) > 0 ? gettype($request->input('regions')[0]) : 'no regions',
            'sessionId' => session()->getId(),
            'authCheck' => Auth::check(),
            'user' => Auth::user() ? Auth::user()->toArray() : null
        ]);
        
        $user = Auth::user();
        
        // Debug information
        if (!$user) {
            \Log::info('No authenticated user found', [
                'sessionId' => session()->getId(),
                'authCheck' => Auth::check(),
                'allHeaders' => $request->headers->all()
            ]);
            return response()->json(['error' => 'User not authenticated', 'debug' => 'No authenticated user found'], 401);
        }
        
        if ($user->role !== 'Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Admins can manage user regions.', 'debug' => 'User role: ' . $user->role], 403);
        }
        
        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json(['error' => 'User not found.'], 404);
        }
        
        if ($targetUser->role !== 'Regional Admin') {
            return response()->json(['error' => 'Only Regional Admin users can have multiple regions assigned.'], 400);
        }
        
        $request->validate([
            'regions' => 'required|array',
            'regions.*' => 'required|string|max:255'
        ]);
        
        // Check for duplicate region assignments (only for Admin, not Super Admin)
        if ($user->role === 'Admin') {
            $requestedRegions = $request->regions;
            $existingAssignments = \App\Models\UserRegion::whereIn('region_name', $requestedRegions)
                ->where('user_id', '!=', $targetUser->id)
                ->get();
            
            if ($existingAssignments->count() > 0) {
                $duplicateRegions = $existingAssignments->pluck('region_name')->toArray();
                $duplicateUsers = \App\Models\User::whereIn('id', $existingAssignments->pluck('user_id'))
                    ->get(['id', 'name', 'surname'])
                    ->map(function($user) {
                        return $user->name . ' ' . $user->surname;
                    })
                    ->toArray();
                
                return response()->json([
                    'error' => 'Some regions are already assigned to other Regional Admins',
                    'duplicate_regions' => $duplicateRegions,
                    'assigned_to' => $duplicateUsers
                ], 400);
            }
        }
        
        // For Super Admin: Remove existing assignments for requested regions from other users
        if ($user->role === 'Super Admin') {
            $requestedRegions = $request->regions;
            \App\Models\UserRegion::whereIn('region_name', $requestedRegions)
                ->where('user_id', '!=', $targetUser->id)
                ->delete();
        }
        
        // Clear existing regions
        $targetUser->assignedRegions()->delete();
        
        // Add new regions (store region names directly)
        foreach ($request->regions as $regionName) {
            $targetUser->assignedRegions()->create([
                'region_name' => $regionName
            ]);
        }
        
        return response()->json([
            'success' => true, 
            'message' => 'User regions updated successfully',
            'assigned_regions' => $targetUser->getAssignedRegionNames()
        ]);
    });
    
    // Re-assign regions from one Regional Admin to another
    Route::post('/admin/users/{fromUserId}/reassign-regions', function ($fromUserId, Request $request) {
        \Log::info('Re-assign regions API hit', [
            'fromUserId' => $fromUserId,
            'requestData' => $request->all(),
            'sessionId' => session()->getId(),
            'authCheck' => Auth::check(),
            'user' => Auth::user() ? Auth::user()->toArray() : null
        ]);
        
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if ($user->role !== 'Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Admins can re-assign regions.'], 403);
        }
        
        $request->validate([
            'to_user_id' => 'required|integer|exists:users,id',
            'regions' => 'required|array',
            'regions.*' => 'required|string|max:255'
        ]);
        
        $fromUser = User::find($fromUserId);
        $toUser = User::find($request->to_user_id);
        
        if (!$fromUser || !$toUser) {
            return response()->json(['error' => 'One or both users not found.'], 404);
        }
        
        if ($fromUser->role !== 'Regional Admin' || $toUser->role !== 'Regional Admin') {
            return response()->json(['error' => 'Both users must be Regional Admins.'], 400);
        }
        
        $regionsToReassign = $request->regions;
        
        // Check if the target user already has any of these regions
        $existingAssignments = \App\Models\UserRegion::whereIn('region_name', $regionsToReassign)
            ->where('user_id', $toUser->id)
            ->get();
        
        if ($existingAssignments->count() > 0) {
            $duplicateRegions = $existingAssignments->pluck('region_name')->toArray();
            return response()->json([
                'error' => 'Target user already has some of these regions assigned',
                'duplicate_regions' => $duplicateRegions
            ], 400);
        }
        
        // Remove regions from source user
        \App\Models\UserRegion::where('user_id', $fromUserId)
            ->whereIn('region_name', $regionsToReassign)
            ->delete();
        
        // Add regions to target user
        foreach ($regionsToReassign as $regionName) {
            $toUser->assignedRegions()->create([
                'region_name' => $regionName
            ]);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Regions re-assigned successfully',
            'from_user' => [
                'id' => $fromUser->id,
                'name' => $fromUser->name . ' ' . $fromUser->surname,
                'remaining_regions' => $fromUser->fresh()->getAssignedRegionNames()
            ],
            'to_user' => [
                'id' => $toUser->id,
                'name' => $toUser->name . ' ' . $toUser->surname,
                'new_regions' => $toUser->fresh()->getAssignedRegionNames()
            ],
            'reassigned_regions' => $regionsToReassign
        ]);
    });
});

// Public API for carousel images
Route::get('/carousel-images', function () {
    $carousels = \App\Models\Carousel::active()->ordered()->get(['id', 'title', 'image_path']);
    
    return response()->json($carousels->map(function($carousel) {
        return [
            'id' => $carousel->id,
            'title' => $carousel->title,
            'image' => '/storage/carousel/' . $carousel->image_path
        ];
    }));
});

// Username validation API for tournament registration
Route::post('/validate-username', function (Request $request) {
    $request->validate([
        'username' => 'required|string',
        'university' => 'required|string'
    ]);
    
    $username = $request->input('username');
    $university = $request->input('university');
    
    $user = \App\Models\User::where('username', $username)
        ->where('university', $university)
        ->whereIn('state', ['Verified', 'Renew', 'Active']) // Include different valid states
        ->whereNotIn('role', ['SL', 'Regional Admin', 'Admin', 'Super Admin'])
        ->first();
    
    return response()->json([
        'exists' => $user ? true : false,
        'user' => $user ? [
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'surname' => $user->surname,
            'university' => $user->university,
            'state' => $user->state
        ] : null
    ]);
});
