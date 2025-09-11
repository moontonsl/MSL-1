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
use App\Http\Controllers\AuthController;
use App\Models\User;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\VotingController;
use App\Http\Controllers\BracketTeamController;
use App\Http\Controllers\MlAuthController;
use App\Http\Controllers\GoogleSheetController;
use App\Http\Controllers\SpreadSheetAutomationController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Mccs2PredictionsController;
use App\Http\Controllers\GoogleSheetMCCS2Controller;

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
        
        // Check if user has SL role
        if ($user->role !== 'SL') {
            return redirect()->route('dashboard')->with('error', 'Access denied. Only Student Leaders can access this page.');
        }
        $verified = User::where('state', 'Verified')->count();
        $new      = User::where('state', 'New')->count();
        $blocked  = User::where('state', 'Blocked')->count();
        return Inertia::render('SLAdmin/SLAdmin',[
            'user' => $user,
            'verified' => $verified,
            'new' => $new,
            'blocked' => $blocked
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
// // Route::post('/login', [AuthController::class, 'login'])->name('login');

//ACCOUNT REGISTRATION ROUTES
Route::get('/register', function () {
    return Inertia::render('Account Creation/Register');
})->name('register');

//EVENT  ROUTES
Route::get('/Events', function () {
    return Inertia::render('Events/Events');
})->name('Events');

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
})->name('MCCWatchFestReg');

//STUDENT PORTAL
Route::get('/studentportal', function () {
    return Inertia::render('Student Portal/SLStudent', [
        'user' => Auth::user(),
    ]);
})->middleware(['auth', 'verified'])->name('SLStudent');

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

// Individual News Pages
Route::get('/news/stronger-ties-moonton-umak', function () {
    return Inertia::render('Individual News Pages/Stronger Ties News/index');
})->name('news.stronger-ties');

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
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
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

Route::get('/mcc/predictions', [VotingController::class, 'index'])->name('predictions.index');
Route::post('/mcc/predictions', [VotingController::class, 'store'])->name('predictions.vote');

Route::get('/mcc/MCCFavourites', [Mccs2PredictionsController::class, 'show'])->name('mccs2predictions.show');
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

Route::get('/get-old-users', function () {
    // Set to 0 for no time limit, essential for large migrations
    set_time_limit(0);
    ini_set('memory_limit', '-1'); // Optional: removes memory limit for this script
    return "test";
    $count = 0;
  
    DB::table('msl_user_basic')
        ->join('msl_user_mlbb', 'msl_user_mlbb.userid', '=', 'msl_user_basic.userid')
        ->join('msl_user_school', 'msl_user_school.userid', '=', 'msl_user_basic.userid')
        ->join('msl_user_account', 'msl_user_account.userid', '=', 'msl_user_basic.userid')
        ->select(
            'msl_user_basic.userid as ml_id',
            'msl_user_basic.givenname as name',
            'msl_user_basic.surname as surname',
            'msl_user_basic.suffix as suffix',
            'msl_user_basic.email as email',
            'msl_user_basic.birthday as birthday',
            'msl_user_basic.age as age',
            'msl_user_basic.gender as gender',
            'msl_user_basic.contact as contact',
            'msl_user_basic.username as username',
            'msl_user_mlbb.mslserver as ml_server',
            'msl_user_mlbb.mslign as ml_ign',
            'msl_user_mlbb.mslsquad1 as squadName',
            'msl_user_mlbb.mslsquad2 as squadAbbreviation',
            'msl_user_mlbb.mslrole as inGameRole',
            'msl_user_mlbb.mslhero as mainHero',
            'msl_user_mlbb.mslrank as rank',
            'msl_user_school.schoolyear as year_level',
            'msl_user_school.schoolarea as island',
            'msl_user_school.schoolregion as region',
            'msl_user_school.schoolid as studentId',
            'msl_user_school.schoolcourse as course',
            'msl_user_school.schoolname as university',
            'msl_user_account.facebook as facebook_link',
            'msl_user_account.password as password'
        )
        ->orderBy('msl_user_basic.userid') // Important: Must order by the chunking column
        ->chunkById(200, function ($old_users_chunk) use (&$count) {
            foreach ($old_users_chunk as $old_user) {
                $email = trim($old_user->email ?? '');
                $ml_id = $old_user->ml_id;
                $username = trim($old_user->username ?? '');
            
                // Check for duplicate email (used by a different ml_id)
                if (!empty($email)) {
                    $existingEmail = \App\Models\User::where('email', $email)
                        ->where('ml_id', '!=', $ml_id)
                        ->exists();
                    if ($existingEmail) {
                        continue; // Skip this user
                    }
                }
            
                // Check for duplicate ml_id (used by a different user)
                if (!empty($ml_id)) {
                    $existingMlId = \App\Models\User::where('ml_id', $ml_id)
                        ->where('email', '!=', $email)
                        ->exists();
                    if ($existingMlId) {
                        continue; // Skip this user
                    }
                }
            
                // Check for duplicate username (used by a different ml_id)
                if (!empty($username)) {
                    $existingUsername = \App\Models\User::where('username', $username)
                        ->where('ml_id', '!=', $ml_id)
                        ->exists();
                    if ($existingUsername) {
                        continue; // Skip this user
                    }
                }
            
                // Prepare other fields
                $gender = ($old_user->gender === 'Empty' || is_null($old_user->gender)) ? 'other' : $old_user->gender;
                $facebook_link = $old_user->facebook_link ?? '';
                if (strlen($facebook_link) > 255) {
                    $facebook_link = '';
                }
            
                \App\Models\User::updateOrCreate(
                    ['ml_id' => $ml_id], // Unique key
                    [
                        'name'              => trim($old_user->name ?? ''),
                        'surname'           => $old_user->surname ?? '',
                        'suffix'            => $old_user->suffix ?? '',
                        'email'             => $email,
                        'password'          => $old_user->password ?? '', // SECURITY WARNING: Passwords should be hashed.
                        'username'          => $username,
                        'birthday'          => $old_user->birthday,
                        'age'               => $old_user->age,
                        'gender'            => $gender,
                        'contact_number'    => $old_user->contact ?? '',
                        'facebook_link'     => $facebook_link,
                        'ml_server'         => $old_user->ml_server ?? '',
                        'ml_ign'            => $old_user->ml_ign ?? '',
                        'squadName'         => $old_user->squadName ?? '',
                        'squadAbbreviation' => $old_user->squadAbbreviation ?? '',
                        'inGameRole'        => $old_user->inGameRole ?? '',
                        'mainHero'          => $old_user->mainHero ?? '',
                        'rank'              => $old_user->rank ?? '',
                        'studentId'         => $old_user->studentId ?? '',
                        'course'            => $old_user->course ?? '',
                        'university'        => $old_user->university ?? '',
                        'year_level'        => $old_user->year_level ?? '',
                        'region'            => $old_user->region ?? '',
                        'island'            => $old_user->island ?? '',
                    ]
                );
                $count++;
            }
        }, 'msl_user_basic.userid', 'ml_id'); // FIXED: Correct column for chunking

    return "User migration completed successfully! Processed " . $count . " records.";
})->name('old');
//update user type
Route::get('/update-user-type', function () {
    return "test";
    set_time_limit(0);
    $users = DB::table('msl_user_mlbb')->get();
    foreach ($users as $user) {
        $get = User::where('ml_id', $user->userid)->first();
        if($get){
            $get->ml_id = $user->mslid;
            $get->save();
            echo $user->userid." ".$get->ml_id." updated"."<br>";
        }else{
            echo $user->userid." not found"."<br>";
        }
    }
})->name('update-user-type');

Route::get('/jabu-test-forauto-deployment-main-staging', function () {
    return "test";
})->name('jabutest');
Route::get('/add-old-accounts', function () {
    set_time_limit(0);
    $old_users = DB::table('msl_user_mlbb')->get();
    $counte = 0;
    $counto = 0;
    foreach ($old_users as $old_user) {
        $users = User::where('ml_id', $old_user->mslid)->where('ml_server', $old_user->mslserver)->first();
        if($users){
            echo $old_user->mslid." already exists"."<br>";
            $counte++;
        }else{
            echo $old_user->mslid." not found"."<br>";
            echo $old_user->userid." not found 1"."<br>";
            $par = User::where('ml_id', $old_user->userid)->where('ml_server', $old_user->mslserver)->first();
            if($par){
                echo $par->email." found ".$old_user->mslid."<br>";
                echo $old_user->userid." found"."<br>";
            }else{
                echo $old_user->userid." not found 2"."<br>";
            }
            $counto++;
        }
    }
    echo "total: ".($counte+$counto)."<br>";
    echo "existing: ".$counte." not found: ".$counto;
    return "existing: ".$counte." not found: ".$counto;
})->name('add-old-accounts');
Route::get('/get-acc', function () {
    // Set unlimited execution time and memory
    set_time_limit(0);
    ini_set('memory_limit', '-1');
    ini_set('max_execution_time', 0);
    
    // Disable output buffering for real-time progress
    if (ob_get_level()) {
        ob_end_clean();
    }
    ob_implicit_flush(true);
    
    $name = "jabu";
    $email = "jabu";
    $password = "jabu";
    $ml_id  = "jabu";
    $ml_server  = "jabu";
    $ml_ign = "jabu";
    $username = "jabu";
    $surname = "jabu";
    $suffix = "jabu";
    $birthday = "jabu";
    $age = "jabu";
    $gender = "jabu";
    $contact_number = "jabu";
    $facebook_link = "jabu";
    $course = "jabu";
    $university = "jabu";
    $year_level = "jabu";
    $studentId = "jabu";
    $region = "jabu";
    $island = "jabu";
    $squadAbbreviation = "jabu";
    $SquadName = "jabu";
    $inGameRole = "jabu";
    $mainHero = "jabu";
    $rank = "jabu";
    $role = "jabu";
    $state = "jabu";
    
    $updateCount = 0;
    $processedCount = 0;
    $countExist = 0;
    $countNot = 0;
    // Use chunking to process data in smaller batches
    DB::table('msl_user_mlbb')
        ->orderBy('id') // Important: Must order by the chunking column
        ->chunkById(500, function ($users_chunk) use (&$updateCount, &$processedCount) {
                         foreach ($users_chunk as $user) {
                 $processedCount++;
                
                 // Add progress indicator
                 if ($processedCount % 500 == 0) {
                     echo "Processed: " . $processedCount . " records<br>";
                     // Flush output buffer t o show progress
                     if (ob_get_level()) {
                         ob_flush();
                         flush();
                     }
                 }
                 // Skip the problematic record 12909 for now
                if ($user->id == 12909) {
                    echo "SKIPPING problematic record 12909<br>";
                    continue;
                }
                 // Skip if we're near the problematic record for debugging
                 if ($processedCount >= 12790 && $processedCount <= 12795) {
                     echo "DEBUG: Processing record " . $processedCount . " (ID: " . $user->id . ")<br>";
                     echo "DEBUG: User data: " . json_encode($user) . "<br>";
                 }
                 
                 // Skip the problematic record 12792 for now
                 if ($processedCount == 12792) {
                     echo "SKIPPING problematic record 12792<br>";
                     continue;
                 }
                 
                 try {
                //ign mslid mslserver squad name squad1 squad2 rank ml role hero
                $ml_ign             = isset($user->mslign) ? $user->mslign : "";
                $ml_id              = isset($user->mslid) ? $user->mslid : "";
                $ml_server          = isset($user->mslserver) ? $user->mslserver : "";
                $squadName          = isset($user->mslsquad1) ? $user->mslsquad1 : "";
                $squadAbbreviation  = isset($user->mslsquad2) ? $user->mslsquad2 : "";
                $rank               = isset($user->mslrank) ? $user->mslrank : "";
                $mainHero           = isset($user->mslhero) ? $user->mslhero : "";
                $inGameRole         = isset($user->mslrole) ? $user->mslrole : "";

                $basic = DB::table('msl_user_basic')->where('userid', $user->userid)->first();
                $email              = isset($basic->email) ? $basic->email : "";
                $username           = isset($basic->username) ? $basic->username : "";
                $name               = isset($basic->givenname) ? $basic->givenname : "";
                $surname            = isset($basic->surname) ? $basic->surname : "";
                $suffix             = isset($basic->suffix) ? $basic->suffix : "";
                $birthday           = isset($basic->birthday) ? $basic->birthday : "";
                $age                = isset($basic->age) ? $basic->age : "";
                if($basic->age == "" || $basic->age == "null"){
                    $age = 0;
                }else{
                    $age = $age;
                }
                if($basic->gender == "Empty" || $basic->gender == "null"){
                    $gender = "other";
                }else{
                    $gender = $basic->gender;
                }
                $contact_number     = isset($basic->contact) ? $basic->contact : "";
                
                $account = DB::table('msl_user_account')->where('userid', $user->userid)->first();

                $password = isset($account->password) ? $account->password : "";
                $facebook_link = isset($account->facebook) ? $account->facebook : "";
                $state = isset($account->state) ? $account->state : "";
                $role = isset($account->administrator) ? $account->administrator : "user";

                $school = DB::table('msl_user_school')->where('userid', $user->userid)->first();

                $course = isset($school->schoolcourse) ? $school->schoolcourse : "";
                $university = isset($school->schoolname) ? $school->schoolname : "";
                $year_level = isset($school->schoolyear) ? $school->schoolyear : "";
                $studentId = isset($school->schoolid) ? $school->schoolid : "";
                $region = isset($school->schoolregion) ? $school->schoolregion : "";
                $island = isset($school->schoolarea) ? $school->schoolarea : "";
                
                // Create data array for User model
                $userData = [
                    'name'       => isset($name) ? $name : "waley",
                    'email'      => isset($email) ? $email : "waley",
                    'password'   => isset($password) ? $password : "waley",
                    'ml_id'      => isset($ml_id) ? $ml_id : "waley",
                    'ml_server'  => isset($ml_server) ? $ml_server : "waley",
                    'ml_ign'     => isset($ml_ign) ? $ml_ign : "waley",
                    'username'   => isset($username) ? $username : "waley",
                    'surname'    => isset($surname) ? $surname : "waley",
                    'suffix'     => isset($suffix) ? $suffix : "waley",
                    'birthday'   => isset($birthday) ? $birthday : "waley",
                    'age'        => isset($age) ? $age : 0,
                    'gender'     => isset($gender) ? $gender : "waley",
                    'contact_number' => isset($contact_number) ? $contact_number : "waley",
                    'facebook_link'  => isset($facebook_link) ? $facebook_link : "waley",
                    'course'         => isset($course) ? $course : "waley",
                    'university'     => isset($university) ? $university : "waley",
                    'year_level'     => isset($year_level) ? $year_level : "waley",
                    'studentId'      => isset($studentId) ? $studentId : "waley",
                    'region'         => isset($region) ? $region : "waley",
                    'island'         => isset($island) ? $island : "waley",
                    'squadAbbreviation' => isset($squadAbbreviation) ? $squadAbbreviation : "waley",
                    'squadName'         => isset($squadName) ? $squadName : "waley",
                    'inGameRole'        => isset($inGameRole) ? $inGameRole : "waley",
                    'mainHero'          => isset($mainHero) ? $mainHero : "waley",
                    'rank'              => isset($rank) ? $rank : "waley",
                    'role'              => isset($role) ? $role : "waley",
                    'state'             => isset($state) ? $state : "waley", 
                ];
                
                $ifmlexist = User::where('ml_id', $ml_id)->where('ml_server', $ml_server)->first();
                if($ifmlexist){
                    echo "[".$user->id."] ML ID and ML Server Already exist<br>";
                    echo "ml_id: ".$ml_id."<br>"; 
                    echo "ml_server: ".$ml_server."<br>";
                    echo "email: ".$email."<br>";
                    echo "username: ".$username."<br>";
                    echo "name: ".$name."<br>";
                    echo "surname: ".$surname."<br>";
                }else{
                    
                    $ifemail = User::where('email', $email)->first();
                    $ifusername = User::where('username', $username)->first();
                    if($ifemail || $ifusername){
                        echo "[".$user->id."] ML ID and ML Not Found But Email and Username Already exist<br>";
                        echo "ml_id: ".$ml_id."<br>"; 
                        echo "ml_server: ".$ml_server."<br>";
                        echo "email: ".$email."<br>";
                        echo "username: ".$username."<br>";
                        echo "name: ".$name."<br>";
                        echo "surname: ".$surname."<br>";
                    }else{
                        // here mag insert
                        $create = User::create($userData);
                        if($create){
                            echo "[".$user->id."] Inserted<br>";
                            echo "ml_id: ".$ml_id."<br>"; 
                            echo "ml_server: ".$ml_server."<br>";
                            echo "email: ".$email."<br>";
                            echo "username: ".$username."<br>";
                            echo "name: ".$name."<br>";
                            echo "surname: ".$surname."<br>";

                        }else{
                            echo "[".$user->id."] Not Inserted<br>";
                            echo "ml_id: ".$ml_id."<br>"; 
                            echo "ml_server: ".$ml_server."<br>";
                            echo "email: ".$email."<br>";
                            echo "username: ".$username."<br>";
                            echo "name: ".$name."<br>";
                            echo "surname: ".$surname."<br>";
                        }
                    }
                }
                echo "====================<br>";
                 // Option 1: Create new user (will fail if ml_id already exists)
                //  User::create($userData);
 
                 // Option 2: Update or create user (recommended)
                 // User::updateOrCreate(
                 //     ['ml_id' => $ml_id], // Unique key to check
                 //     $userData // Data to insert/update
                 // );
 
                 // echo "Processed user: " . $ml_id . "<br>";
                 
                 $updateCount++;
                //  echo $updateCount." bilang <br>";
                 
                 } catch (Exception $e) {
                    echo "Facebook link too long ".$facebook_link."<br>";
                    // echo "ERROR at record " . $processedCount . " (ID: " . $user->id . "): " . $e->getMessage() . "<br>";
                    echo "Skipping this record and continuing...<br>";
                    continue; // Skip this record and continue with next
                 }
             }
        }, 'id'); // Close the chunking function
        
        echo "Total processed: " . $processedCount . "<br>";
        echo "Total updated: " . $updateCount . "<br>";
        return "done";
   
})->name('add-old-accounts-get');


Route::get('/remove-users-no-proof-of-enrollment', function () {
    set_time_limit(0);
    
    // Count users before deletion
    $usersBefore = User::where('proofOfEnrollment', NULL)->count();
    
    // Delete users where proofOfEnrollment is null
    $deletedCount = User::where('proofOfEnrollment', NULL)->delete();
    
    echo "Users before deletion: " . $usersBefore . "<br>";
    echo "Users deleted: " . $deletedCount . "<br>";
    echo "Operation completed successfully!";


    
    return "Users deleted: " . $deletedCount;
})->name('remove-users-no-proof');
require __DIR__.'/auth.php';

