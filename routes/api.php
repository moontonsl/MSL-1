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
});
