<?php

// Include admin and auth routes
require __DIR__.'/admin.php';
require __DIR__.'/auth.php';

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolUploadController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\NewsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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
use App\Http\Controllers\Mccs2PredictionsController;
use App\Http\Controllers\GoogleSheetMCCS2Controller;
use App\Http\Controllers\Admin\DuplicateUsernameController;

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

// Campus Tournament listing/management page (updated routes)
Route::get('/Tournament/SL', function () {
    return Inertia::render('Campus Tournament/CampusTournament');
})->name('campus.tournament');

// Team Registration page (updated route)
Route::get('/Tournament/CampusTournamentReg', function () {
    return Inertia::render('Campus Tournament/TeamRegistration');
})->name('campus.teamregistration');

// Captain Registration page (updated route and filename mapping)
Route::get('/Tournament/CampusTournament', function () {
    return Inertia::render('Campus Tournament/Registration');
})->name('campus.captainregistration');


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
        }

        return Inertia::render('SLAdmin/SLAdmin',[
            'user' => $user,
            'verified' => $verified,
            'new' => $new,
            'renewed' => $renewed,
            'blocked' => $blocked,
            'studentLeaders' => $studentLeaders
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
Route::get('/BuffsAndSupport', function () {
    return Inertia::render('BuffsAndSupport/BuffsAndSupport');
})->name('BuffsAndSupport');

//MSL APPLICATION ROUTES
Route::get('/MSLApplication', function () {
    return Inertia::render('MSLApplication/MSLApplication');
})->name('MSLApplication');

//NEXT SPOOF ROUTES
Route::get('/NEXTSpoof', function () {
    return Inertia::render('NEXTSpoof/NEXTSpoof');
})->name('NEXTSpoof');

//ACCOUNT MODIFICATION WAITING ROUTES
Route::get('/AccountModificationWaiting', function () {
    return Inertia::render('AccountModification/AccountModificationWaiting');
})->name('AccountModificationWaiting');

//SL ADMIN APPROVAL ROUTES
Route::get('/SLAdminApproval', function () {
    return Inertia::render('ApprovalPages/SLAdminApproval');
})->name('SLAdminApproval');

//TERMS AND CONDITIONS ROUTES
Route::get('/TermsAndConditions', function () {
    return Inertia::render('TermsAndConditions/TermsAndConditions');
})->name('TermsAndConditions');

//PRIVACY AND POLICY ROUTES
Route::get('/PrivacyPolicy', function () {
    return Inertia::render('PrivacyPolicy/PrivacyPolicy');
})->name('PrivacyPolicy');

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
                return response()->json(['error' => 'User not authenticated'], 401);
            }
            
            // Only allow users with 'Renew' state to upload
            if ($user->state !== 'Renew') {
                return response()->json(['error' => 'Upload not allowed for your current account status'], 403);
            }
            
            $request->validate([
                'proofOfEnrollment' => 'required|file|mimes:jpeg,jpg,png,gif,pdf|max:2048', // 2MB max (matches PHP limit)
            ]);
            
            $file = $request->file('proofOfEnrollment');
            
            if (!$file) {
                return response()->json(['error' => 'No file provided'], 400);
            }
            
            $filename = time() . '.' . $file->getClientOriginalExtension();
            
            // Store the file in user-specific directory
            $path = $file->storeAs('users/proofOfEnrollment/' . $user->id, $filename, 'public');
            
            if (!$path) {
                return response()->json(['error' => 'Failed to store file'], 500);
            }
            
            // Update user's proof of enrollment
            $user->update([
                'proofOfEnrollment' => $path,
                'state' => 'New' // Change state back to New for review
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Proof of enrollment uploaded successfully',
                'file_path' => $path
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
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
Route::prefix('mcc')->name('mcc.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('MCC/Main Page/index');
    })->name('main');

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
        'student_leaders' => DB::table('users')->where('user_type', 'SL')->count(),
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
        // Show only Student Leaders (SL role) for Regional Admin
        $query->where('users.role', 'SL');
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
        if ($user->role !== 'Super Admin') {
            return response()->json(['error' => 'Access denied. Only Super Admins can delete users.'], 403);
        }
        
        $query = \App\Models\User::where('id', $userId)->where('role', '!=', 'SL');
        
        // Super Admin can delete any user (no additional filtering)
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
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
            'proofOfEnrollment' => null
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
        if ($user->role !== 'Regional Admin') {
            return response()->json(['error' => 'Access denied. Only Regional Admins can promote users to Student Leader.'], 403);
        }
        
        $query = \App\Models\User::where('id', $userId)
            ->where('role', '!=', 'SL')
            ->where('role', '!=', 'Admin')
            ->where('role', '!=', 'Super Admin')
            ->where('role', '!=', 'Regional Admin')
            ->where('region', $user->region)
            ->where('state', 'Verified'); // Only promote verified users
        
        $targetUser = $query->first();
            
        if (!$targetUser) {
            return response()->json(['error' => 'User not found, not verified, or access denied.'], 404);
        }
        
        $targetUser->update([
            'role' => 'SL'
        ]);
        
        return response()->json(['success' => true, 'message' => 'User promoted to Student Leader successfully']);
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