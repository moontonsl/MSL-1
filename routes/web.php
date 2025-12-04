<?php

// Include admin and auth routes
require __DIR__.'/admin.php';
require __DIR__.'/auth.php';

// User Management Panel (No Auth Required)
// Route::get('/user-management', [\App\Http\Controllers\UserManagementController::class, 'index'])->name('user-management');
// Route::get('/user-management/api', [\App\Http\Controllers\UserManagementController::class, 'getUsers'])->name('user-management.api');
// Route::post('/user-management/delete', [\App\Http\Controllers\UserManagementController::class, 'bulkDeleteUsers'])->name('user-management.delete');

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolUploadController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\CampusController;
use App\Mail\MslNetworkInquiryMail;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
//jabu
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController as AuthControllerClass;
use App\Models\User;
use App\Models\UserRegion;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\VotingController;
use App\Http\Controllers\BracketTeamController;
use App\Http\Controllers\MlAuthController;
use App\Http\Controllers\GoogleSheetController;
use App\Http\Controllers\SpreadSheetAutomationController;
use App\Http\Controllers\FF25AttendanceController;
use App\Http\Controllers\Mccs2PredictionsController;
use App\Http\Controllers\GoogleSheetMCCS2Controller;
use App\Http\Controllers\Admin\DuplicateUsernameController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CodashopController;

Route::get('/', function () {
    return Inertia::render('Home/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// About Page Route
Route::get('/about', function () {
    return Inertia::render('About Page/index');
})->name('about');

// Campus Tournament main route - redirects based on user role
Route::get('/campus-tournament', function () {
    $user = Auth::user();
    
    if (!$user) {
        return redirect()->route('login');
    }
    
    // Redirect based on user role
    if ($user->role === 'SL') {
        return redirect()->route('campus.tournament.sl');
    } elseif ($user->role === 'Regional Admin') {
        return redirect()->route('campus.tournament.regionaladmin');
    } else {
        // For other users, redirect to SL view or show access denied
        return redirect()->route('campus.tournament.sl');
    }
})->middleware(['auth', 'verified'])->name('campus.tournament');

// Campus Tournament listing/management page for SL
Route::get('/Tournament/SL', [\App\Http\Controllers\CampusTournamentController::class, 'slIndex'])
    ->middleware(['auth', 'verified'])->name('campus.tournament.sl');

// Public route to view all approved tournaments with teams (for testing)
Route::get('/campus-tournament/public', [\App\Http\Controllers\CampusTournamentController::class, 'publicIndex'])
    ->name('campus.tournament.public');

// Team Registration page (updated route)
Route::get('/Tournament/CampusTournamentReg', function () {
    return Inertia::render('Campus Tournament/TeamRegistration');
})->name('campus.teamregistration');

// Campus Team page - shows logged-in player's team
Route::get('/Tournament/CampusTournamentTeam', [\App\Http\Controllers\CampusTournamentController::class, 'teamView'])
    ->name('campus.team');

// Captain Registration page (updated route and filename mapping)
Route::get('/Tournament/CampusTournament', function () {
    return Inertia::render('Campus Tournament/Registration');
})->name('campus.captainregistration');

// Regional Admin - Tournament Requests page
Route::get('/Tournament/RegionalAdmin', [\App\Http\Controllers\CampusTournamentController::class, 'regionalAdminIndex'])
    ->middleware(['auth', 'verified'])->name('campus.tournament.regionaladmin');



// Campus Tournament API routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/campus-tournaments', [\App\Http\Controllers\CampusTournamentController::class, 'store'])->name('campus.tournaments.store');
    Route::post('/campus-tournaments/{id}/approve', [\App\Http\Controllers\CampusTournamentController::class, 'approve'])->name('campus.tournaments.approve');
    Route::post('/campus-tournaments/{id}/reject', [\App\Http\Controllers\CampusTournamentController::class, 'reject'])->name('campus.tournaments.reject');
    Route::post('/campus-tournaments/{id}/submit-results', [\App\Http\Controllers\CampusTournamentController::class, 'submitResults'])->name('campus.tournaments.submit-results');
    Route::delete('/campus-tournaments/{id}', [\App\Http\Controllers\CampusTournamentController::class, 'destroy'])->name('campus.tournaments.destroy');
});

// API endpoints for Campus Tournament registration
Route::get('/user-info', function () {
    $user = Auth::user();
    return response()->json(['user' => $user]);
})->middleware(['auth', 'verified']);

Route::get('/approved-tournaments', function () {
    // Only return approved tournaments that are active (results not submitted and within registration period)
    $tournaments = \App\Models\CampusTournament::where('status', 'approved')
        ->where('results_submitted', false)
        ->where('start_date', '<=', now())
        ->where('end_date', '>=', now())
        ->get();
    return response()->json($tournaments);
});

Route::get('/team-check', function (\Illuminate\Http\Request $request) {
    // Get user ID from request parameter since we're not logged in
    $userId = $request->query('user_id');
    
    if (!$userId) {
        return response()->json(['isInTeam' => false], 400);
    }
    
    // Only check for teams in active tournaments (results not submitted)
    $teamMember = \App\Models\CampusTournamentTeamMember::whereHas('team.tournament', function($query) {
        $query->where('status', 'approved')
              ->where('results_submitted', false);
    })->where('player_id', $userId)->first();
    
    return response()->json([
        'isInTeam' => $teamMember ? true : false,
        'isCaptain' => $teamMember ? $teamMember->role === 'captain' : false
    ]);
});

// User search API for modification requests
Route::middleware(['auth', 'verified'])->get('/api/users/search', function (\Illuminate\Http\Request $request) {
    $user = Auth::user();
    
    // Only SL and Regional Admin can search users
    if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
        return response()->json(['error' => 'Access denied'], 403);
    }
    
    $search = $request->query('search', '');
    $limit = $request->query('limit', 10);
    $modificationType = $request->query('modification_type', '');
    
    if (strlen($search) < 2) {
        return response()->json([]);
    }
    
    $query = \App\Models\User::select(
        'id', 'username', 'name', 'surname', 'email', 'university', 'course', 'year_level', 'region', 'island'
    );
    
    // Apply role-based filtering
    // For SL users: if modification type is "School", allow searching everyone regardless of region/university
    // Otherwise, filter by university (current behavior)
    if ($user->role === 'SL') {
        if ($modificationType !== 'School') {
            $query->where('university', $user->university);
        }
        // If modificationType is 'School', no region/university filter is applied
    } elseif ($user->role === 'Regional Admin') {
        $assignedRegionIds = $user->getAssignedRegionIds();
        if (!empty($assignedRegionIds)) {
            $query->whereIn('region', $assignedRegionIds);
        } else {
            $query->where('region', $user->region);
        }
    }
    
    // Search in username, name, surname, email
    $query->where(function($q) use ($search) {
        $q->where('username', 'like', '%' . $search . '%')
          ->orWhere('name', 'like', '%' . $search . '%')
          ->orWhere('surname', 'like', '%' . $search . '%')
          ->orWhere('email', 'like', '%' . $search . '%');
    });
    
    $users = $query->limit($limit)->get();
    
    return response()->json($users);
});

// Get specific user by ID for modification requests
Route::middleware(['auth', 'verified'])->get('/api/users/{id}', function ($id) {
    $user = Auth::user();
    
    // Only SL and Regional Admin can view users
    if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
        return response()->json(['error' => 'Access denied'], 403);
    }
    
    $targetUser = \App\Models\User::select(
        'users.id', 
        'users.name', 
        'users.surname', 
        'users.username', 
        'users.email',
        'users.contact_number',
        'users.course',
        'users.studentId',
        'users.region',
        'users.island',
        'users.ml_id', 
        'users.ml_server', 
        'users.ml_ign',
        'users.university', 
        'users.year_level', 
        'users.state', 
        'users.blocked_reason',
        'users.verified_by',
        'users.verified_date',
        'users.proofOfEnrollment',
        'users.created_at',
        'ml_users.current_rank',
        'ml_users.highest_rank',
        'ml_users.level',
        'ml_users.matches_played',
        'ml_users.matches_won',
        'ml_users.win_rate',
        'ml_users.favorite_heroes',
        'verifiers.name as verifier_name',
        'verifiers.surname as verifier_surname'
    )
        ->leftJoin('ml_users', 'users.ml_id', '=', 'ml_users.ml_id')
        ->leftJoin('users as verifiers', 'users.verified_by', '=', 'verifiers.id')
        ->where('users.id', $id)
        ->first();
    
    if (!$targetUser) {
        return response()->json(['error' => 'User not found'], 404);
    }
    
    // Apply role-based filtering
    if ($user->role === 'SL') {
        if ($targetUser->university !== $user->university) {
            return response()->json(['error' => 'Access denied'], 403);
        }
    } elseif ($user->role === 'Regional Admin') {
        $assignedRegionIds = $user->getAssignedRegionIds();
        if (!empty($assignedRegionIds)) {
            if (!in_array($targetUser->region, $assignedRegionIds)) {
                return response()->json(['error' => 'Access denied'], 403);
            }
        } else {
            if ($targetUser->region !== $user->region) {
                return response()->json(['error' => 'Access denied'], 403);
            }
        }
    }
    
    return response()->json($targetUser);
});

// Modification request API endpoints
Route::middleware(['auth', 'verified'])->group(function () {
    // Get modification requests
    Route::get('/api/modification-requests', function (\Illuminate\Http\Request $request) {
        $user = Auth::user();
        
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied'], 403);
        }
        
        $query = \App\Models\ModificationRequest::with(['user', 'submittedBy', 'approvedBy']);
        
        // Apply role-based filtering
        if ($user->role === 'SL') {
            // Student Leaders can only see their own requests
            $query->where('submitted_by', $user->id);
        } elseif ($user->role === 'Regional Admin') {
            // Regional Admins can see requests from their assigned regions
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereHas('user', function($q) use ($assignedRegionIds) {
                    $q->whereIn('region', $assignedRegionIds);
                });
            } else {
                $query->whereHas('user', function($q) use ($user) {
                    $q->where('region', $user->region);
                });
            }
        }
        // Super Admin can see all requests from all regions (no filtering applied)
        
        // Order by status: Pending -> Approved -> Rejected, then by created_at desc
        $requests = $query->orderByRaw("CASE 
            WHEN status = 'Pending' THEN 1 
            WHEN status = 'Approved' THEN 2 
            WHEN status = 'Rejected' THEN 3 
            ELSE 4 
        END")
        ->orderBy('created_at', 'desc')
        ->paginate(10);
        
        // Ensure relationships are included in JSON response and add verifier info
        $requests->getCollection()->transform(function ($request) {
            $request->load(['user', 'submittedBy', 'approvedBy']);
            
            // Add verifier information if user is verified
            if ($request->user && $request->user->verified_by) {
                $verifier = \App\Models\User::select('name', 'surname')
                    ->where('id', $request->user->verified_by)
                    ->first();
                if ($verifier) {
                    $request->user->verifier_name = $verifier->name;
                    $request->user->verifier_surname = $verifier->surname;
                }
            }
            
            return $request;
        });
        
        return response()->json($requests);
    });
    
    // Create modification request
    Route::post('/api/modification-requests', function (\Illuminate\Http\Request $request) {
        $user = Auth::user();
        
        // Only SL can create modification requests
        if ($user->role !== 'SL') {
            return response()->json(['error' => 'Only Student Leaders can create modification requests'], 403);
        }
        
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'modification_type' => 'required|in:Full Name,School,Course',
            'wrong_value' => 'required|string',
            'correct_value' => 'required|string',
        ]);
        
        $modificationRequest = \App\Models\ModificationRequest::create([
            'user_id' => $request->user_id,
            'modification_type' => $request->modification_type,
            'wrong_value' => $request->wrong_value,
            'correct_value' => $request->correct_value,
            'submitted_by' => $user->id,
            'status' => 'Pending',
        ]);
        
        return response()->json(['success' => true, 'request' => $modificationRequest]);
    });
    
    // Approve/Reject modification request
    Route::post('/api/modification-requests/{id}/approve', function (\Illuminate\Http\Request $request, $id) {
        $user = Auth::user();
        
        // Only Regional Admin can approve/reject
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins can approve requests'], 403);
        }
        
        $modificationRequest = \App\Models\ModificationRequest::findOrFail($id);
        
        if ($modificationRequest->status !== 'Pending') {
            return response()->json(['error' => 'Request has already been processed'], 400);
        }
        
        // Use database transaction to ensure atomicity
        \DB::beginTransaction();
        
        try {
            // Update the user's data first (before updating status)
            $targetUser = $modificationRequest->user;
            
            if (!$targetUser) {
                \DB::rollBack();
                return response()->json(['error' => 'User not found'], 404);
            }
            
            switch ($modificationRequest->modification_type) {
                case 'Full Name':
                    $nameParts = explode(' ', $modificationRequest->correct_value, 2);
                    $targetUser->update([
                        'name' => $nameParts[0],
                        'surname' => $nameParts[1] ?? '',
                    ]);
                    break;
                case 'School':
                    // When school is changed, also update region and island to match the new school
                    $newSchoolName = $modificationRequest->correct_value;
                    $school = \App\Models\School::with('region.island')
                        ->where('name', $newSchoolName)
                        ->first();
                    
                    if ($school && $school->region) {
                        $regionId = $school->region->id ?? null;
                        $regionName = $school->region->name ?? null;
                        if ($regionName) {
                            $regionName = preg_replace('/^\d+\s*-\s*/', '', $regionName);
                            $regionName = trim($regionName);
                        }
                        
                        // Get island name and clean it similarly
                        $islandName = null;
                        if ($school->region->island) {
                            $islandName = $school->region->island->name ?? null;
                            if ($islandName) {
                                $islandName = preg_replace('/^\d+\s*-\s*/', '', $islandName);
                                $islandName = trim($islandName);
                            }
                        }
                        
                        // Update university, region (ID), and island (name)
                        $updateData = [
                            'university' => $newSchoolName,
                        ];
                        
                        if ($regionId !== null) {
                            $updateData['region'] = $regionId;
                        }
                        
                        if ($islandName) {
                            $updateData['island'] = $islandName;
                        }
                        
                        $targetUser->update($updateData);
                    } else {
                        // If school not found, just update university (fallback)
                        $targetUser->update(['university' => $newSchoolName]);
                    }
                    break;
                case 'Course':
                    $targetUser->update(['course' => $modificationRequest->correct_value]);
                    break;
            }
            
            // Only update status after user data is successfully updated
            $modificationRequest->update([
                'status' => 'Approved',
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
            
            \DB::commit();
            
            return response()->json(['success' => true, 'message' => 'Request approved successfully']);
            
        } catch (\Exception $e) {
            \DB::rollBack();
            
            return response()->json([
                'error' => 'Failed to approve request: ' . $e->getMessage()
            ], 500);
        }
    });
    
    Route::post('/api/modification-requests/{id}/reject', function (\Illuminate\Http\Request $request, $id) {
        $user = Auth::user();
        
        // Only Regional Admin can approve/reject
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Only Regional Admins can reject requests'], 403);
        }
        
        $modificationRequest = \App\Models\ModificationRequest::findOrFail($id);
        
        if ($modificationRequest->status !== 'Pending') {
            return response()->json(['error' => 'Request has already been processed'], 400);
        }
        
        $modificationRequest->update([
            'status' => 'Rejected',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        
        return response()->json(['success' => true]);
    });
});

Route::get('/school-players', function (\Illuminate\Http\Request $request) {
    try {
        $search = $request->query('search', '');
        $excludeIds = $request->query('exclude', '');
        $university = $request->query('university', '');
        
        if (!$university) {
            return response()->json(['message' => 'University parameter required'], 400);
        }
        
        // Convert exclude string to array if it's not empty
        $excludeArray = [];
        if ($excludeIds) {
            $excludeArray = explode(',', $excludeIds);
            $excludeArray = array_filter($excludeArray, function($id) {
                return is_numeric($id);
            });
        }
        
            $query = \App\Models\User::where('university', $university)
                ->where('state', 'Verified') // Only verified users
                ->where('role', '!=', 'SL')
                ->where('role', '!=', 'Regional Admin')
                ->where('role', '!=', 'Admin')
                ->where('role', '!=', 'Super Admin');
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('username', 'like', '%' . $search . '%')
                  ->orWhere('name', 'like', '%' . $search . '%')
                  ->orWhere('surname', 'like', '%' . $search . '%');
            });
        }
        
        if (!empty($excludeArray)) {
            $query->whereNotIn('id', $excludeArray);
        }
        
        // Exclude players who are already in teams from tournaments that haven't submitted results yet
        $query->whereNotExists(function($q) {
            $q->select(\DB::raw(1))
              ->from('campus_tournament_team_members')
              ->join('campus_tournament_teams', 'campus_tournament_team_members.team_id', '=', 'campus_tournament_teams.id')
              ->join('campus_tournaments', 'campus_tournament_teams.tournament_id', '=', 'campus_tournaments.id')
              ->whereRaw('campus_tournament_team_members.player_id = users.id')
              ->where('campus_tournaments.results_submitted', false);
        });
        
        $players = $query->limit(10)->get(['id', 'username', 'name', 'surname']);
        
        return response()->json($players);
    } catch (\Exception $e) {
        \Log::error('School players search error: ' . $e->getMessage());
        return response()->json(['error' => 'Search failed', 'message' => $e->getMessage()], 500);
    }
});

// Check username for tournament registration (checks existence and verification status)
Route::get('/check-username-tournament', function (\Illuminate\Http\Request $request) {
    try {
        $username = $request->query('username', '');
        $university = $request->query('university', '');
        
        if (!$username || !$university) {
            return response()->json(['error' => 'Username and university parameters required'], 400);
        }
        
        // Check if user exists in the university (regardless of verification status)
        $user = \App\Models\User::where('username', $username)
            ->where('university', $university)
            ->where('role', '!=', 'SL')
            ->where('role', '!=', 'Regional Admin')
            ->where('role', '!=', 'Admin')
            ->where('role', '!=', 'Super Admin')
            ->first(['id', 'username', 'name', 'surname', 'university', 'state']);
        
        if (!$user) {
            return response()->json([
                'exists' => false,
                'verified' => false,
                'message' => 'Username not found in ' . $university
            ]);
        }
        
        // User exists, check verification status
        if ($user->state === 'Verified') {
            return response()->json([
                'exists' => true,
                'verified' => true,
                'message' => 'VALID',
                'user' => $user
            ]);
        } else {
            return response()->json([
                'exists' => true,
                'verified' => false,
                'message' => 'Username not verified',
                'user' => $user
            ]);
        }
    } catch (\Exception $e) {
        \Log::error('Username tournament check error: ' . $e->getMessage());
        return response()->json(['error' => 'Check failed', 'message' => $e->getMessage()], 500);
    }
});

// FF25 attendance username checker
Route::get('/ff25/check-username', [FF25AttendanceController::class, 'checkUsername'])->name('ff25.check-username');

Route::post('/validate-credentials', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);
    
    // Validate credentials without logging in
    if (Auth::attempt($request->only('username', 'password'))) {
        $user = Auth::user();
        Auth::logout(); // Don't keep them logged in, just validate
        
        return response()->json(['user' => $user]);
    }
    
    return response()->json(['message' => 'Invalid credentials'], 401);
});

// Faulty Username Update Route (Signed)
Route::get('/update-username/{user}', [\App\Http\Controllers\FaultyUsernameController::class, 'showUpdateForm'])
    ->name('username.update.form')
    ->middleware('signed');

Route::post('/update-username/{user}', [\App\Http\Controllers\FaultyUsernameController::class, 'updateUsername'])
    ->name('username.update.submit');

Route::post('/team-registration', function (\Illuminate\Http\Request $request) {
    // Validate the request
    $request->validate([
        'teamName' => 'required|string|max:50',
        'discordId' => 'required|string|max:50',
        'captain' => 'required|array',
        'captain.id' => 'required|integer',
        'captain.university' => 'required|string',
        'players' => 'required|array',
        'players.player2' => 'required|array',
        'players.player3' => 'required|array',
        'players.player4' => 'required|array',
        'players.player5' => 'required|array',
    ]);
    
    $captain = $request->captain;
    
    // Check if captain's school has an active approved tournament
    $tournament = \App\Models\CampusTournament::where('school_name', $captain['university'])
        ->where('status', 'approved')
        ->where('results_submitted', false)
        ->where('start_date', '<=', now())
        ->where('end_date', '>=', now())
        ->first();
    
    if (!$tournament) {
        return response()->json(['message' => 'No active tournament found for your school. Tournament may have ended or results already submitted.'], 400);
    }
    
    // Check if team name already exists
    $existingTeam = \App\Models\CampusTournamentTeam::where('team_name', $request->teamName)
        ->where('tournament_id', $tournament->id)
        ->first();
    
    if ($existingTeam) {
        return response()->json(['message' => 'Team name already exists'], 400);
    }
    
    // Create team
    $team = \App\Models\CampusTournamentTeam::create([
        'tournament_id' => $tournament->id,
        'team_name' => $request->teamName,
        'discord_id' => $request->discordId,
        'captain_id' => $captain['id'],
    ]);
    
    // Add all players to team
    $players = [
        $request->players['captain'],
        $request->players['player2'],
        $request->players['player3'],
        $request->players['player4'],
        $request->players['player5'],
    ];
    
    foreach ($players as $player) {
        \App\Models\CampusTournamentTeamMember::create([
            'team_id' => $team->id,
            'player_id' => $player['id'],
            'role' => $player['id'] === $captain['id'] ? 'captain' : 'member',
        ]);
    }
    
    return response()->json(['message' => 'Team registered successfully', 'team_id' => $team->id]);
});

Route::put('/team-update/{teamId}', function (\Illuminate\Http\Request $request, $teamId) {
    // Validate the request
    $request->validate([
        'teamName' => 'required|string|max:50',
        'discordId' => 'required|string|max:50',
        'captain' => 'required|array',
        'captain.id' => 'required|integer',
        'captain.university' => 'required|string',
        'players' => 'required|array',
        'players.player2' => 'required|array',
        'players.player3' => 'required|array',
        'players.player4' => 'required|array',
        'players.player5' => 'required|array',
    ]);
    
    $captain = $request->captain;
    
    // Find the existing team
    $team = \App\Models\CampusTournamentTeam::find($teamId);
    
    if (!$team) {
        return response()->json(['message' => 'Team not found'], 404);
    }
    
    // Check if captain is the team captain
    if ($team->captain_id !== $captain['id']) {
        return response()->json(['message' => 'Only the team captain can edit the team'], 403);
    }
    
    // Check if team name already exists (excluding current team)
    $existingTeam = \App\Models\CampusTournamentTeam::where('team_name', $request->teamName)
        ->where('tournament_id', $team->tournament_id)
        ->where('id', '!=', $teamId)
        ->first();
    
    if ($existingTeam) {
        return response()->json(['message' => 'Team name already exists'], 400);
    }
    
    // Update team details
    $team->update([
        'team_name' => $request->teamName,
        'discord_id' => $request->discordId,
    ]);
    
    // Delete existing team members
    \App\Models\CampusTournamentTeamMember::where('team_id', $teamId)->delete();
    
    // Add all players to team
    $players = [
        $request->players['captain'],
        $request->players['player2'],
        $request->players['player3'],
        $request->players['player4'],
        $request->players['player5'],
    ];
    
    foreach ($players as $player) {
        \App\Models\CampusTournamentTeamMember::create([
            'team_id' => $teamId,
            'player_id' => $player['id'],
            'role' => $player['id'] === $captain['id'] ? 'captain' : 'member',
        ]);
    }
    
    return response()->json(['message' => 'Team updated successfully', 'team_id' => $teamId]);
});


// Admin routes are defined in routes/admin.php

// Event Management Routes
Route::middleware(['auth:admin', 'admin'])->group(function () {
    Route::get('/admin/events', [AdminController::class, 'manageEvents'])->name('admin.events');
    Route::get('/admin/events/create', [AdminController::class, 'createEvent'])->name('admin.events.create');
    Route::post('/admin/events', [AdminController::class, 'storeEvent'])->name('admin.events.store');
    Route::get('/admin/events/{event}/edit', [AdminController::class, 'editEvent'])->name('admin.events.edit');
    Route::put('/admin/events/{event}', [AdminController::class, 'updateEvent'])->name('admin.events.update');
    Route::delete('/admin/events/{event}', [AdminController::class, 'deleteEvent'])->name('admin.events.delete');
    
    // Analytics Routes
    Route::get('/admin/analytics', function () {
        $analyticsService = app(\App\Services\AnalyticsService::class);
        $analytics = $analyticsService->getKeyMetrics();
        $pageViewsData = $analyticsService->getPageViewsLast7Days();
        $topPages = $analyticsService->getTopPages();
        $realTimeData = $analyticsService->getRealTimeData();
        
        return Inertia::render('Admin/Analytics', [
            'analytics' => [
                'pageViews' => $pageViewsData,
                'metrics' => $analytics,
                'topPages' => $topPages,
                'realTime' => $realTimeData
            ]
        ]);
    })->name('admin.analytics');
});

Route::get('/notfound', function () {return Inertia::render('Errors/NotFound');})->name('notfound');

// SL ADMIN ROUTES
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/sl-admin', function () {
        $user = Auth::user();
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return redirect()->route('dashboard')->with('error', 'Access denied. Only Student Leaders, Regional Admins, and Super Admins can access this page.');
        }

        $query = User::query();

        if ($user->role === 'SL') {
            $query->where('university', $user->university);
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereIn('region', $assignedRegionIds);
            } else {
                $query->where('region', $user->region);
            }
        }

        $verified = (clone $query)->where('state', 'Verified')->count();
        $new      = (clone $query)->where('state', 'New')->count();
        $renewed  = (clone $query)->where('state', 'Renew')->count();
        $blocked  = (clone $query)->where('state', 'Blocked')->count();
        
        $studentLeaders = 0;
        if ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $studentLeaders = User::where('role', 'SL')->whereIn('region', $assignedRegionIds)->count();
            } else {
                $studentLeaders = User::where('role', 'SL')->where('region', $user->region)->count();
            }
        } elseif ($user->role === 'Super Admin') {
            // Super Admin can see all Student Leaders
            $studentLeaders = User::where('role', 'SL')->count();
        }

        $regionalAdmins = 0;
        if ($user->role === 'Super Admin') {
            $regionalAdmins = User::where('role', 'Regional Admin')->count();
        }

        return Inertia::render('SLAdmin/SLAdmin',[
            'user' => $user,
            'verified' => $verified,
            'new' => $new,
            'renewed' => $renewed,
            'blocked' => $blocked,
            'studentLeaders' => $studentLeaders,
            'regionalAdmins' => $regionalAdmins
        ]);
    })->name('sl-admin');
});


// Route::get('/sl-admin', function () {
//     $user = Auth::user();
    
//     // Check if user is authenticated
//     if (!$user) {
//         return redirect()->route('login');
//     }
//     // Check if user has SL role
//     if ($user->user_type !== 'SL') { // Assuming 'SL' is the role for Student Leaders
//         return redirect()->route('dashboard')->with('error', 'Access denied. Only Student Leaders can access this page.');
//     }
//     return Inertia::render('SLAdmin/SLAdmin');
// })->name('sl-admin');


Route::inertia('/upload', 'SchoolUploader');
Route::post('/upload-schools', [SchoolUploadController::class, 'store'])->name('upload-schools');
Route::get('/schools/search', [SchoolController::class, 'search']);
Route::get('/regions', [SchoolController::class, 'getRegions']);

//LOGIN ROUTES
Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');
// // Route::post('/login', [AuthControllerClass::class, 'login'])->name('login');

//ACCOUNT REGISTRATION ROUTES
Route::get('/register', function () {
    return Inertia::render('Account Creation/Register');
})->name('register');

//EVENT  ROUTES
Route::get('/Events', [\App\Http\Controllers\EventsController::class, 'index'])->name('Events');
Route::get('/Events/{event}', [\App\Http\Controllers\EventsController::class, 'show'])->name('Events.show');

//PROGRAMS  ROUTES
Route::get('/Programs', function () {
    return Inertia::render('Programs/Programs');
})->name('Programs');

//BUFFS AND SUPPORT  ROUTES
Route::get('/BuffsAndSupport', [App\Http\Controllers\BuffsAndSupportController::class, 'index'])->name('BuffsAndSupport');

//BUFFS AND SUPPORT - APPLICATION FORM ROUTES
Route::get('/BuffsAndSupport/Apply', function () {
    return Inertia::render('BuffsAndSupport/Forms/MSLBuffsAndSupportApplicationForm');
})->name('MSLBuffsAndSupportApplicationForm');

//BUFFS AND SUPPORT - TOURNAMENT LOBBY APPLICATION FORM ROUTES
Route::get('/MSLTournamentLobbyApplicationForm', function () {
    return Inertia::render('BuffsAndSupport/Forms/MSLTournamentLobbyApplicationForm');
})->name('MSLTournamentLobbyApplicationForm');

//MSL APPLICATION ROUTES
Route::get('/MSLApplication', function () {
    return Inertia::render('MSLApplication/MSLApplication');
})->name('MSLApplication');

//NEXT SPOOF ROUTES
Route::get('/NEXTSpoof', function () {
    return Inertia::render('NEXTSpoof/NEXTSpoof');
})->name('NEXTSpoof');

//ANNIVERSARY 9TH POSTING CONTEST ROUTES
Route::get('/9thPoster', function () {
    return Inertia::render('Anniversary9th/9THPoster');
})->name('9THPoster');

//ANNIVERSARY 9TH GLAM UP ROUTES
Route::get('/9thGlamUp', function () {
    return Inertia::render('Anniversary9th/9THGlamUp');
})->name('9THGlamUp');

//ACCOUNT MODIFICATION WAITING ROUTES
Route::get('/AccountModificationWaiting', function () {
    return Inertia::render('AccountModification/AccountModificationWaiting');
})->name('AccountModificationWaiting');

//OPPO X MSL ROAD SHOW TOURNAMENT ROUTES
Route::get('/RoadshowTournament', function () {
    return Inertia::render('OPPOxMSLRoadShowTournament/OPPOxMSLRoadShowTournament');
})->name('OPPOxMSLRoadShowTournament');


//OPPO X MSL ROAD SHOW TOURNAMENT ATTENDANCE ROUTES
Route::get('/RoadshowAttendance', function () {
    return Inertia::render('OPPOxMSLRoadShowTournament/RoadshowAttendance');
})->name('RoadshowAttendance');

//FF25 LANDING PAGE ROUTES
Route::get('/FF25', function () {
    return Inertia::render('FF25/FF25');
})->name('FF25LandingPage');


//FF25 ATTENDANCE PAGE ROUTES
Route::get('/FF25Attendance', function () {
    return Inertia::render('FF25/FF25Attendance');
})->name('FF25Attendance');
Route::post('/FF25Attendance', [FF25AttendanceController::class, 'store'])->name('ff25.attendance.store');


//SL ADMIN APPROVAL ROUTES - Only SL role can access
Route::middleware(['auth', 'verified'])->get('/SLAdminApproval', function () {
    $user = Auth::user();
    
    // Only SL role can access this page
    if ($user->role !== 'SL') {
        abort(403, 'Access denied. Only Student Leaders can access this page.');
    }
    
    return Inertia::render('ApprovalPages/SLAdminApproval', [
        'user' => $user
    ]);
})->name('SLAdminApproval');

//ADMIN REGIONAL APPROVAL ROUTES - Regional Admin and Super Admin can access
Route::middleware(['auth', 'verified'])->get('/RegionalAdminApproval', function () {
    $user = Auth::user();
    
    // Regional Admin and Super Admin can access this page
    if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
        abort(403, 'Access denied. Only Regional Admins and Super Admins can access this page.');
    }
    
    return Inertia::render('ApprovalPages/RegionalAdminApproval', [
        'user' => $user
    ]);
})->name('RegionalAdminApproval');

//MSL NETWORK ROUTES
Route::get('/MSLNetwork', function () {
    return Inertia::render('MSLNetwork/MSLNetwork');
})->name('MSLNetwork');

//TERMS AND CONDITIONS ROUTES
Route::get('/TermsAndConditions', function () {
    return Inertia::render('TermsAndConditions/TermsAndConditions');
})->name('TermsAndConditions');

//PRIVACY AND POLICY ROUTES
Route::get('/PrivacyPolicy', function () {
    return Inertia::render('PrivacyPolicy/PrivacyPolicy');
})->name('PrivacyPolicy');

//FAQS ROUTES
Route::get('/FAQs', function () {
    return Inertia::render('FAQs/FAQS');
})->name('FAQs');

Route::get('/FAQsResult', function () {
    return Inertia::render('FAQs/FAQS Result');
})->name('FAQsResult');

//PROGRAMS  ROUTES
Route::get('/MPLS16Battletrips', function () {
    return Inertia::render('BattleTrips/MPLS16Battletrips');
})->name('MPLS16Battletrips');

//EVENT  ROUTES - MCC WATCHFEST REG
Route::get('/MCCWatchFestReg', function () {
    return Inertia::render('MCCWatchFest/MCCWatchFestReg');
})->middleware(['auth', 'verified', \App\Http\Middleware\CheckUserState::class])->name('MCCWatchFestReg');

//STUDENT PORTAL
Route::get('/studentportal', function () {
    return Inertia::render('Student Portal/SLStudent', [
        'user' => Auth::user(),
    ]);
})->middleware(['auth', 'verified', \App\Http\Middleware\CheckUserState::class])->name('SLStudent');

// User state-specific pages
Route::middleware(['auth', 'verified', \App\Http\Middleware\CheckUserState::class])->group(function () {
    Route::get('/user/waiting', function () {
        return Inertia::render('User/Waiting', [
            'user' => Auth::user(),
        ]);
    })->name('user.waiting');
    
    Route::get('/user/upload', function () {
        return Inertia::render('User/UploadPage', [
            'user' => Auth::user(),
        ]);
    })->name('user.upload');
    
    Route::get('/user/blocked', function () {
        return Inertia::render('User/Blocked', [
            'user' => Auth::user(),
        ]);
    })->name('user.blocked');
});

// API endpoint for uploading proof of enrollment (separate from middleware group)
Route::post('/api/user/upload-proof', function (\Illuminate\Http\Request $request) {
        try {
            $user = Auth::user();
            
            if (!$user) {
                \Log::warning('Upload attempt by unauthenticated user');
                return response()->json(['error' => 'User not authenticated'], 401);
            }
            
            // Only allow users with 'Renew' state to upload
            if ($user->state !== 'Renew') {
                \Log::warning('Upload attempt by user with state: ' . $user->state . ' (User ID: ' . $user->id . ')');
                return response()->json(['error' => 'Upload not allowed for your current account status'], 403);
            }
            
            $request->validate([
                'proofOfEnrollment' => 'required|file|mimes:jpeg,jpg,png,gif,pdf|max:2048', // 2MB max
                'year_level' => 'required|string|max:255',
            ], [
                'proofOfEnrollment.required' => 'Please select a file to upload.',
                'proofOfEnrollment.file' => 'The uploaded file is not valid.',
                'proofOfEnrollment.mimes' => 'The file must be a JPEG, PNG, GIF, or PDF.',
                'proofOfEnrollment.max' => 'The file size must not exceed 2MB.',
                'year_level.required' => 'Please select your year level.',
                'year_level.string' => 'Year level must be a valid selection.',
            ]);
            
            $file = $request->file('proofOfEnrollment');
            
            if (!$file) {
                return response()->json(['error' => 'No file provided'], 400);
            }
            
            $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Store the file in user-specific directory
            $path = $file->storeAs('users/proofOfEnrollment/' . $user->id, $filename, 'public');
            
            if (!$path) {
                \Log::error('File storage failed for user ' . $user->id);
                return response()->json(['error' => 'Failed to store file. Please try again.'], 500);
            }
            
            // Update user's proof of enrollment with full path and year level
            $fullPath = 'users/proofOfEnrollment/' . $user->id . '/' . $filename;
            $user->update([
                'proofOfEnrollment' => $fullPath,
                'year_level' => $request->year_level,
                'state' => 'New' // Change state back to New for review
            ]);
            
            \Log::info('Proof of enrollment and year level updated successfully', [
                'user_id' => $user->id,
                'file_path' => $fullPath,
                'file_size' => $file->getSize(),
                'year_level' => $request->year_level
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Proof of enrollment uploaded and year level updated successfully',
                'file_path' => $fullPath
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = $e->validator->errors()->all();
            return response()->json(['error' => implode(', ', $errors)], 422);
        } catch (\Exception $e) {
            \Log::error('Upload error: ' . $e->getMessage());
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    })->middleware(['auth', 'verified']);

//TEMPORARY LOGOUT CODES - PA CHECK PO B.E THANK YOU
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    // ->middleware('auth') // Ensure only authenticated users can log out
    ->name('logout');

// MCC Routes
Route::prefix('MCC')->name('MCC.')->group(function () {
    Route::get('/', function () {
        return redirect('/MCC/S2'); // Default to Season 2
    })->name('main');
    
    Route::get('/S2', function () {
        return Inertia::render('MCC Season 2/MCC Season 2');
    })->name('season2');
    
    Route::get('/S1', function () {
        return Inertia::render('MCC Season 2/MCC Season 1');
    })->name('season1');

    Route::get('/calendar', function () {
        return Inertia::render('MCC/Calendar/index');
    })->name('calendar');

    // Voting Routes
    Route::prefix('voting')->name('voting.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('MCC/Voting/Voting Sign In/Index');
        })->name('signin');

        Route::get('/vote', function () {
            return Inertia::render('MCC/Voting/Vote/Index');
        })->name('vote');

        Route::get('/winners', function () {
            return Inertia::render('MCC/Voting/Winners/Index');
        })->name('winners');
    });
});

// Resources Routes
Route::prefix('resources')->name('resources.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Resources/index');
    })->name('main');

    Route::get('/campus', function () {
        return Inertia::render('Resources/Campus/index');
    })->name('campus');

    Route::get('/directory', function () {
        return Inertia::render('Resources/Directory/index');
    })->name('directory');

    Route::get('/assets', function () {
        return Inertia::render('Resources/Assets/index');
    })->name('assets');
});

// News Routes
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news-articles', [NewsController::class, 'getArticles'])->name('news.articles');
Route::get('/news-highlights', [NewsController::class, 'getHighlights'])->name('news.highlights');
Route::get('/news-related', [NewsController::class, 'getRelatedArticles'])->name('news.related');
// Individual News Pages
Route::get('/news/stronger-ties-moonton-umak', function () {
    return Inertia::render('Individual News Pages/Stronger Ties News/index');
})->name('news.stronger-ties');

Route::get('/news/{canonical}', [NewsController::class, 'show'])->name('news.show');
// data count routes
Route::get('/stats', function () {
    return [
        'student_players' => DB::table('users')->count(),
        'student_leaders' => DB::table('users')->where('role', 'SL')->count(),
        'university_communities' => DB::table('msl_schools')->count(),
        'school_partners' => DB::table('msl_school_partner')->count(),

    ];
});
Route::post('/send-verification-code', [VerifyEmailController::class, 'sendCode']);
Route::get('/check-ml-id', [VerifyEmailController::class, 'checkMlId']);
Route::get('/check-ml-id-availability', [VerifyEmailController::class, 'checkMlIdAvailability']);
Route::get('/get-user-by-ml-id', [VerifyEmailController::class, 'getUserByMlId']);
Route::get('/validate-ml-id', [VerifyEmailController::class, 'validateMlId']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', \App\Http\Middleware\CheckUserState::class])->name('dashboard');

Route::middleware(['auth', \App\Http\Middleware\CheckUserState::class])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/api/bracket-teams/{bracketName}', [BracketTeamController::class, 'getTeamsByBracket']);
Route::get('/api/bracket-teams', [BracketTeamController::class, 'getAllBrackets']);
Route::patch('/api/bracket-teams/{bracketName}/status', [BracketTeamController::class, 'updateBracketStatus']);

//WAG MAG REMOVE DITO KUNG DI ALAM ANG GINAGAWA
// ML User Authentication Routes
Route::prefix('ml')->group(function () {
    Route::get('/login', [MlAuthController::class, 'showLoginForm'])->name('ml.login');
    Route::post('/login', [MlAuthController::class, 'login'])->name('ml.login.submit');
    Route::post('/logout', [MlAuthController::class, 'logout'])->name('ml.logout');
    Route::post('/verify-token', [MlAuthController::class, 'verifyToken'])->name('ml.verify-token');
});

Route::post('/ml/logout', [MlAuthController::class, 'logout'])->name('ml.logout');

Route::get('/mcc/predictions', [VotingController::class, 'index'])->middleware(['auth', 'verified', \App\Http\Middleware\CheckUserState::class])->name('predictions.index');
Route::post('/mcc/predictions', [VotingController::class, 'store'])->name('predictions.vote');

Route::get('/mcc/MCCFavourites', [Mccs2PredictionsController::class, 'show'])->middleware(['auth', 'verified', \App\Http\Middleware\CheckUserState::class])->name('mccs2predictions.show');
Route::post('/mcc/MCCFavourites/teams', [Mccs2PredictionsController::class, 'storeTeams'])->name('mccs2predictions.storeTeams');
Route::post('/mcc/MCCFavourites/players', [Mccs2PredictionsController::class, 'storePlayers'])->name('mccs2predictions.storePlayers');

Route::get('/soon', function () {
    return Inertia::render('Soon/Soon');
})->name('soon');

// Google Sheet Routes
Route::get('/google-sheet', [GoogleSheetController::class, 'exportToGoogleSheet'])->name('google-sheet.export');
Route::get('/google-sheet-mccs2', [GoogleSheetMCCS2Controller::class, 'exportMCCS2PredictionsToGoogleSheet'])->name('google-sheet-mccs2.export');

//SpreadSheet Automation Routes
Route::get('/import-from-spreadsheet', [SpreadSheetAutomationController::class, 'importFromSpreadsheet'])->name('import-from-spreadsheet');

// Spreadsheet Automation Routes
Route::get('/spreadsheet/export-users', [SpreadSheetAutomationController::class, 'exportUsersToSpreadsheet'])->name('spreadsheet.export-users');
//force logout
Route::get('/force-logout', function () {
    Auth::logout();
    return redirect()->route('login');
})->name('force-logout');

// Analytics API endpoint
Route::get('/api/analytics/real-time', function () {
    $analyticsService = app(\App\Services\AnalyticsService::class);
    return response()->json($analyticsService->getRealTimeData());
})->middleware(['auth:admin', 'admin']);

//update user state
Route::get('/update-user-role', function () {
    
    set_time_limit(0);
    $count = 0;
    $account = DB::table('msl_user_account')->where('administrator', '!=', '')
    ->join('msl_user_mlbb', 'msl_user_account.userid', '=', 'msl_user_mlbb.userid')
    ->select('msl_user_account.administrator as adminn', 'msl_user_mlbb.mslid as idid')
    ->get();
    // dd($account);
    foreach($account as $acc){
        $user = User::where('ml_id', $acc->idid)->first();
        if(!empty($user->id)){
            echo "meon ".$user->ml_id."<br>";
            echo "meon ".$acc->adminn."<br>";
            $user->role = $acc->adminn;
            $user->save();
        }else{
            // echo "wala ".$user->ml_id."<br>";
            echo "wala ".$acc->idid."<br>";
        }
        echo "--------------------------------<br>";
        $count++;
    }
    
    echo "Total users: ".$count;
})->name('update-user-type');

require __DIR__.'/auth.php';

// API endpoint for SLAdmin and Regional Admin to get users list
Route::middleware(['auth', 'verified'])->get('/api/sladmin/users', function (\Illuminate\Http\Request $request) {
    $user = Auth::user();
    if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
        return response()->json(['error' => 'Access denied. Only Student Leaders, Regional Admins, and Super Admins can access this resource.'], 403);
    }
    $perPage = $request->query('per_page', 20);
    $query = \App\Models\User::select(
        'users.id', 
        'users.name', 
        'users.surname', 
        'users.username', 
        'users.email',
        'users.contact_number',
        'users.course',
        'users.studentId',
        'users.region',
        'users.island',
        'users.role',
        'users.ml_id', 
        'users.ml_server', 
        'users.university', 
        'users.year_level', 
        'users.state', 
        'users.blocked_reason',
        'users.verified_by',
        'users.verified_date',
        'users.proofOfEnrollment',
        'users.created_at',
        'ml_users.current_rank',
        'ml_users.highest_rank',
        'ml_users.level',
        'ml_users.matches_played',
        'ml_users.matches_won',
        'ml_users.win_rate',
        'ml_users.favorite_heroes',
        'ml_users.ign as ml_ign',
        'verifiers.name as verifier_name',
        'verifiers.surname as verifier_surname'
    )
        ->leftJoin('ml_users', 'users.ml_id', '=', 'ml_users.ml_id')
        ->leftJoin('users as verifiers', 'users.verified_by', '=', 'verifiers.id');
    
    // Apply role-based filtering
    if ($user->role === 'SL') {
        $query->where('users.university', $user->university);
    } elseif ($user->role === 'Regional Admin') {
        $assignedRegionIds = $user->getAssignedRegionIds();
        if (!empty($assignedRegionIds)) {
            $query->whereIn('users.region', $assignedRegionIds);
        } else {
            // Fallback to single region if no assigned regions
            $query->where('users.region', $user->region);
        }
    }
    // Super Admin can view all users (no filtering applied)
    
    // Handle Student Leader filtering
    if ($request->has('state') && $request->query('state') === 'StudentLeaders') {
        // Show only Student Leaders (SL role) for Regional Admin and Super Admin
        // Regional Admin can only see SLs from their assigned regions (already filtered above)
        // Super Admin can see all SLs (no additional filtering needed)
        $query->where('users.role', 'SL');
    } elseif ($request->has('state') && $request->query('state') === 'RegionalAdmins') {
        // Show only Regional Admins for Super Admin
        if ($user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Super Admins can view Regional Admins.'], 403);
        }
        $query->where('users.role', 'Regional Admin');
    } else {
        // Regular filtering - exclude admin roles
        $query->where('users.role', '!=', 'SL')
            ->where('users.role', '!=', 'Admin')
            ->where('users.role', '!=', 'Super Admin')
            ->where('users.role', '!=', 'Regional Admin');
        
        if ($request->has('state')) {
            $query->where('users.state', $request->query('state'));
        }
    }
    
    // Add search functionality
    if ($request->has('search') && !empty($request->query('search'))) {
        $searchTerm = $request->query('search');
        $query->where(function($q) use ($searchTerm) {
            $q->where('users.name', 'like', '%' . $searchTerm . '%')
              ->orWhere('users.surname', 'like', '%' . $searchTerm . '%')
              ->orWhere('users.username', 'like', '%' . $searchTerm . '%')
              ->orWhere('users.ml_id', 'like', '%' . $searchTerm . '%')
              ->orWhere('users.ml_server', 'like', '%' . $searchTerm . '%')
              ->orWhere('users.university', 'like', '%' . $searchTerm . '%')
              ->orWhere('users.year_level', 'like', '%' . $searchTerm . '%')
              ->orWhere('ml_users.ign', 'like', '%' . $searchTerm . '%');
        });
    }
    
    $users = $query->orderByDesc('users.created_at')->paginate($perPage);
    return response()->json($users);
});

// API endpoints for SLAdmin and Regional Admin to update user state
Route::middleware(['auth', 'verified'])->group(function () {
    Route::patch('/api/sladmin/users/{userId}/verify', function ($userId) {
        $user = Auth::user();
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Student Leaders, Regional Admins, and Super Admins can access this resource.'], 403);
        }
        
        $query = \App\Models\User::where('id', $userId)->where('role', '!=', 'SL');
        
        if ($user->role === 'SL') {
            $query->where('university', $user->university);
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereIn('region', $assignedRegionIds);
            } else {
                // Fallback to single region if no assigned regions
                $query->where('region', $user->region);
            }
        }
        // Super Admin can verify any user (no additional filtering)
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'User not found or access denied.'], 404);
        }
        
        // Check if user has proof of enrollment before allowing verification
        if (!$targetUser->proofOfEnrollment) {
            return response()->json(['error' => 'Cannot verify user without proof of enrollment. The user must upload their proof of enrollment document first.'], 400);
        }
        
        $targetUser->update([
            'state' => 'Verified',
            'verified_by' => $user->id,
            'verified_date' => now()
        ]);
        
        return response()->json(['success' => true, 'message' => 'User verified successfully']);
    });
    
    Route::patch('/api/sladmin/users/{userId}/block', function ($userId, \Illuminate\Http\Request $request) {
        $user = Auth::user();
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Student Leaders, Regional Admins, and Super Admins can access this resource.'], 403);
        }
        
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);
        
        $query = \App\Models\User::where('id', $userId)->where('role', '!=', 'SL');
        
        if ($user->role === 'SL') {
            $query->where('university', $user->university);
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereIn('region', $assignedRegionIds);
            } else {
                // Fallback to single region if no assigned regions
                $query->where('region', $user->region);
            }
        }
        // Super Admin can block any user (no additional filtering)
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'User not found or access denied.'], 404);
        }
        
        $targetUser->update([
            'state' => 'Blocked',
            'blocked_reason' => $request->reason
        ]);
        
        return response()->json(['success' => true, 'message' => 'User blocked successfully']);
    });
    
    Route::delete('/api/sladmin/users/{userId}', function ($userId) {
        $user = Auth::user();
        
        // Check if user has permission to delete
        if ($user->role !== 'Super Admin' && $user->role !== 'Regional Admin') {
            return response()->json(['error' => 'Access denied. Only Super Admins and Regional Admins can delete users.'], 403);
        }
        
        $query = \App\Models\User::where('id', $userId);
        
        // Regional Admin can only delete blocked accounts from their assigned regions
        if ($user->role === 'Regional Admin') {
            // Only allow deleting blocked accounts
            $query->where('state', 'Blocked');
            
            // Filter by assigned regions
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereIn('region', $assignedRegionIds);
            } else {
                // Fallback to single region if no assigned regions
                $query->where('region', $user->region);
            }
            
            // Regional Admins cannot delete admin roles
            $query->where('role', '!=', 'SL')
                  ->where('role', '!=', 'Admin')
                  ->where('role', '!=', 'Super Admin')
                  ->where('role', '!=', 'Regional Admin');
        } else {
            // Super Admin can delete any user except SL
            $query->where('role', '!=', 'SL');
        }
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
            if ($user->role === 'Regional Admin') {
                return response()->json(['error' => 'User not found, not blocked, or not in your assigned regions.'], 404);
            }
            return response()->json(['error' => 'User not found or access denied.'], 404);
        }
        
        $targetUser->delete();
        
        return response()->json(['success' => true, 'message' => 'User deleted successfully']);
    });
    
    Route::patch('/api/sladmin/users/{userId}/renew', function ($userId) {
        $user = Auth::user();
        if ($user->role !== 'SL' && $user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Student Leaders, Regional Admins, and Super Admins can access this resource.'], 403);
        }
        
        $query = \App\Models\User::where('id', $userId)->where('role', '!=', 'SL');
        
        if ($user->role === 'SL') {
            $query->where('university', $user->university);
        } elseif ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereIn('region', $assignedRegionIds);
            } else {
                // Fallback to single region if no assigned regions
                $query->where('region', $user->region);
            }
        }
        // Super Admin can renew any user (no additional filtering)
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'User not found or access denied.'], 404);
        }
        
        $targetUser->update([
            'state' => 'Renew',
            'verified_by' => null,
            'verified_date' => null,
            'proofOfEnrollment' => null,
            'year_level' => null
        ]);
        
        // Send renewal email to the user
        $emailSent = false;
        try {
            \Mail::to($targetUser->email)->send(new \App\Mail\AccountRenewalMail($targetUser));
            $emailSent = true;
        } catch (\Exception $e) {
            // Log the error but don't fail the renewal process
            \Log::error('Failed to send renewal email to user ' . $targetUser->id . ': ' . $e->getMessage());
        }
        
        $message = 'User renewed successfully';
        if ($emailSent) {
            $message .= ' and renewal email sent to ' . $targetUser->email;
        }
        
        return response()->json(['success' => true, 'message' => $message]);
    });
    
    //Pang promote sa student to SL
    Route::patch('/api/sladmin/users/{userId}/promote', function ($userId) {
        $user = Auth::user();
        if ($user->role !== 'Regional Admin' && $user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Regional Admins and Super Admins can promote users to Student Leader.'], 403);
        }
        
        $query = \App\Models\User::where('id', $userId)
            ->where('role', '!=', 'SL')
            ->where('role', '!=', 'Admin')
            ->where('role', '!=', 'Super Admin')
            ->where('role', '!=', 'Regional Admin')
            ->where('state', 'Verified'); // Only promote verified users
        
        // Regional Admin can only promote users from their region
        if ($user->role === 'Regional Admin') {
            $assignedRegionIds = $user->getAssignedRegionIds();
            if (!empty($assignedRegionIds)) {
                $query->whereIn('region', $assignedRegionIds);
            } else {
                $query->where('region', $user->region);
            }
        }
        // Super Admin can promote any verified student (no region restriction)
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'User not found, not verified, or access denied.'], 404);
        }
        
        $targetUser->update([
            'role' => 'SL'
        ]);
        
        return response()->json(['success' => true, 'message' => 'User promoted to Student Leader successfully']);
    });
    
    //Pang promote sa student to Regional Admin (Super Admin only)
    Route::patch('/api/sladmin/users/{userId}/promote-regional-admin', function ($userId) {
        $user = Auth::user();
        if ($user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Super Admins can promote users to Regional Admin.'], 403);
        }
        
        $targetUser = \App\Models\User::where('id', $userId)
            ->where('role', '!=', 'SL')
            ->where('role', '!=', 'Admin')
            ->where('role', '!=', 'Super Admin')
            ->where('role', '!=', 'Regional Admin')
            ->where('state', 'Verified') // Only promote verified users
            ->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'User not found, not verified, or already has an admin role.'], 404);
        }
        
        $targetUser->update([
            'role' => 'Regional Admin'
        ]);
        
        return response()->json(['success' => true, 'message' => 'User promoted to Regional Admin successfully']);
    });
    
    //pang demote ng student leader
    Route::patch('/api/sladmin/users/{userId}/demote', function ($userId) {
        $user = Auth::user();
        if ($user->role !== 'Regional Admin') {
            return response()->json(['error' => 'Access denied. Only Regional Admins can demote Student Leaders.'], 403);
        }
        
        $query = \App\Models\User::where('id', $userId)
            ->where('role', 'SL')
            ->where('region', $user->region);
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'Student Leader not found or access denied.'], 404);
        }
        
        $targetUser->update([
            'role' => 'user' 
        ]);
        
        return response()->json(['success' => true, 'message' => 'Student Leader demoted successfully']);
    });
    
    //pang demote ng Regional Admin to Student (Super Admin only)
    Route::patch('/api/sladmin/users/{userId}/demote-regional-admin', function ($userId) {
        $user = Auth::user();
        if ($user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Super Admins can demote Regional Admins.'], 403);
        }
        
        $targetUser = \App\Models\User::where('id', $userId)
            ->where('role', 'Regional Admin')
            ->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'Regional Admin not found.'], 404);
        }
        
        $targetUser->update([
            'role' => 'user' 
        ]);
        
        return response()->json(['success' => true, 'message' => 'Regional Admin demoted to Student successfully']);
    });
    
});

// Admin routes for managing user regions
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/user-regions', [\App\Http\Controllers\Admin\UserRegionController::class, 'index'])
        ->name('admin.user-regions');
    
});
// Duplicate Username Check
Route::get('/admin/duplicate-usernames/check', [\App\Http\Controllers\Admin\DuplicateUsernameController::class, 'checkDuplicates'])->name('admin.duplicate-usernames.check');
Route::get('/Change-Username/{user_id?}', function ($user_id = null) {
    // Check if this is a signed URL and validate it
    if (request()->hasValidSignature()) {
        $user = null;
        if ($user_id) {
            $user = \App\Models\User::find($user_id);
        }
        
        if (!$user) {
            abort(404, 'User not found');
        }
        
        return Inertia::render('Admin/DuplicateUsernameForm', [
            'user_id' => $user_id,
            'current_username' => $user ? $user->username : null,
            'current_email' => $user ? $user->email : null,
            'user' => $user,
            'expires_at' => request()->query('expires'),
        ]);
    } else {
        // If not a valid signed URL, show expired message
        return Inertia::render('Admin/DuplicateUsernameForm', [
            'user_id' => null,
            'current_username' => null,
            'current_email' => null,
            'user' => null,
            'expired' => true,
        ]);
    }
})->name('admin.duplicate-usernames.form');

Route::post('/Change-Username/{user_id}', function ($user_id) {
    $user = \App\Models\User::findOrFail($user_id);
    
    request()->validate([
        'username' => 'required|string|max:255|unique:users,username,' . $user_id,
    ]);
    
    $user->update(['username' => request('username')]);
    
    return back()->with('status', 'Username updated successfully!');
})->name('admin.duplicate-usernames.update');

// Course API Routes
Route::get('/api/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/api/courses/search', [CourseController::class, 'search'])->name('courses.search');
Route::get('/api/courses/level/{level}', [CourseController::class, 'getByLevel'])->name('courses.by-level');

Route::get('/campus', [CampusController::class, 'index'])->name('campus');

// Public Faulty Username Management Routes (adjust middleware as needed)
Route::prefix('faulty-username')->name('faulty-username.')->group(function () {
    Route::get('/', [\App\Http\Controllers\FaultyUsernameController::class, 'index'])->name('index');
    Route::post('/send-email/{userId}', [\App\Http\Controllers\FaultyUsernameController::class, 'sendEmailToUser'])->name('send-email');
    Route::post('/send-selected', [\App\Http\Controllers\FaultyUsernameController::class, 'sendEmailToSelected'])->name('send-selected');
    Route::post('/send-all', [\App\Http\Controllers\FaultyUsernameController::class, 'sendEmailToAll'])->name('send-all');
    Route::get('/stats', [\App\Http\Controllers\FaultyUsernameController::class, 'getStats'])->name('stats');
});

// Admin Faulty Username Management Routes (with auth protection)
Route::middleware(['auth', 'admin'])->prefix('admin/faulty-username')->name('admin.faulty-username.')->group(function () {
    Route::get('/', [\App\Http\Controllers\FaultyUsernameController::class, 'index'])->name('index');
    Route::post('/send-email/{userId}', [\App\Http\Controllers\FaultyUsernameController::class, 'sendEmailToUser'])->name('send-email');
    Route::post('/send-selected', [\App\Http\Controllers\FaultyUsernameController::class, 'sendEmailToSelected'])->name('send-selected');
    Route::post('/send-all', [\App\Http\Controllers\FaultyUsernameController::class, 'sendEmailToAll'])->name('send-all');
    Route::get('/stats', [\App\Http\Controllers\FaultyUsernameController::class, 'getStats'])->name('stats');
});

//OPPO AMBASSADOR ROUTES
Route::get('/OppoAmbassador', function () {
    return Inertia::render('OppoAmbassador/OppoAmbassador');
})->name('OppoAmbassador');

// MSL Network Email Inquiry Route
Route::post('/msl-network/send-inquiry', function (Request $request) {
    try {
        $request->validate([
            'to_email' => 'required|email',
            'cc_emails' => 'nullable|array',
            'cc_emails.*' => 'nullable|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
            'region' => 'nullable|string|max:100',
        ]);
        
        // Filter out empty CC emails
        $ccEmails = collect($request->cc_emails ?? [])
            ->filter(function($email) {
                return !empty(trim($email));
            })
            ->values()
            ->toArray();

        $inquiryData = [
            'to_email' => $request->to_email,
            'cc_emails' => $ccEmails,
            'subject' => $request->subject,
            'message' => $request->message,
            'region' => $request->region,
            'received_at' => now(),
        ];

        // Send email with CC recipients
        $mail = Mail::to($request->to_email);
        
        if (!empty($ccEmails)) {
            $mail->cc($ccEmails);
        }
        
        $mail->send(new MslNetworkInquiryMail($inquiryData));

        return response()->json([
            'success' => true,
            'message' => 'Your inquiry has been sent successfully! We will get back to you soon.',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Please fill in all required fields correctly.',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        \Log::error('MSL Network inquiry failed: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to send inquiry. Please try again later.',
        ], 500);
    }
})->name('msl-network.send-inquiry');

// Codashop API endpoint (accessible without /api prefix)
Route::get('/codashop/init-payment', function () {
    return response()->json([
        'message' => 'This endpoint requires a POST request',
        'usage' => 'Send a POST request with JSON body containing userId and zoneId',
        'example' => [
            'userId' => '165865941',
            'zoneId' => '3232'
        ]
    ]);
})->name('codashop.init-payment.get');
Route::post('/codashop/init-payment', [\App\Http\Controllers\CodashopController::class, 'initPayment'])->name('codashop.init-payment');

// Custom Event Canonical Routes - Handle dynamic event links like /NewEvent
// This catch-all route should be placed at the very end to avoid conflicts with other routes
Route::get('/{canonical}', function ($canonical) {
    // Check if this canonical matches an MSL Event
    $event = \App\Models\MslEvent::where('event_canonical', '/' . $canonical)
        ->orWhere('event_canonical', $canonical)
        ->first();
    
    if ($event) {
        return app(\App\Http\Controllers\EventsController::class)->show($event);
    }
    
    // If no event found, return 404
    abort(404, 'Event not found');
})->where('canonical', '^[a-zA-Z0-9\-_]+$'); // Only match alphanumeric, hyphens, underscores
