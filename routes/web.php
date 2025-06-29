<?php

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
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Home/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/notfound', function () {return Inertia::render('Errors/NotFound');})->name('notfound');

// SL ADMIN ROUTES
Route::get('/sl-admin', function () {return Inertia::render('SLAdmin/SLAdmin');})->name('sl-admin');


Route::inertia('/upload', 'SchoolUploader');
Route::post('/upload-schools', [SchoolUploadController::class, 'store'])->name('upload-schools');
Route::get('/schools/search', [SchoolController::class, 'search']);

//LOGIN ROUTES
Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');
// // Route::post('/login', [AuthController::class, 'login'])->name('login');

// //LOGIN ROUTES
// Route::get('/login2', function () {
//     return Inertia::render('Login/Login2');
// })->name('login');
// Route::post('/login2', [AuthController::class, 'login'])->name('login2');

//ACCOUNT REGISTRATION ROUTES
Route::get('/register', function () {
    return Inertia::render('Account Creation/Register');
})->name('register');

// //ACCOUNT REGISTRATION 2 ROUTES
// Route::get('/register2', function () {
//     return Inertia::render('Account Creation/Register2');
// })->name('register');


//EVENT  ROUTES
Route::get('/Events', function () {
    return Inertia::render('Events/Events');
})->name('Events');

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

// // TEMPORARY STUDENT PORTAL ACCESS (NO AUTH)
// Route::get('/studentportal', function () {
//     return Inertia::render('Student Portal/SLStudent');
// })->middleware(['auth', 'verified'])->name('SLStudent');

// // TEMPORARY STUDENT PORTAL ACCESS (NO AUTH)
// Route::get('/studentportal', function () {
//     return Inertia::render('Student Portal/SLStudent');
// })->name('SLStudent');


// MCC Routes
Route::prefix('mcc')->name('mcc.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('MCC/Main Page/index');
    })->name('main');

    Route::get('/calendar', function () {
        return Inertia::render('MCC/Calendar/index');
    })->name('calendar');

    // News Route
    Route::get('/news', function () {
        return Inertia::render('News/Index');
    })->name('news');

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

// News Routes
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news-articles', [NewsController::class, 'getArticles'])->name('news.articles');

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

Route::get('/mcc/MCCFavourites', function () {
    return Inertia::render('MCC/MCCS2Predictions/index');
});

Route::get('/soon', function () {
    return Inertia::render('Soon/Soon');
})->name('soon');

// Google Sheet Routes
Route::get('/google-sheet', [GoogleSheetController::class, 'exportToGoogleSheet'])->name('google-sheet.export');
//force logout
Route::get('/force-logout', function () {
    Auth::logout();
    return redirect()->route('login');
})->name('force-logout');

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

require __DIR__.'/auth.php';