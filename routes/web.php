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

Route::get('/', function () {
    return Inertia::render('Home/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/notfound', function () {return Inertia::render('Errors/NotFound');})->name('notfound');
Route::get('/sl-admin', function () {return Inertia::render('SLAdmin/SLAdmin');})->name('sl-admin');


Route::inertia('/upload', 'SchoolUploader');
Route::post('/upload-schools', [SchoolUploadController::class, 'store'])->name('upload-schools');
Route::get('/schools/search', [SchoolController::class, 'search']);

//LOGIN ROUTES
Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');
// Route::post('/login2', [AuthController::class, 'login'])->name('login2');

//ACCOUNT REGISTRATION ROUTES
Route::get('/register', function () {
    return Inertia::render('Account Creation/Register');
})->name('register');


// //STUDENT PORTAL
// Route::get('/studentportal', function () {
//     return Inertia::render('Student Portal/Profile');
// })->middleware(['auth', 'verified'])->name('profile');

// TEMPORARY STUDENT PORTAL ACCESS (NO AUTH)
Route::get('/studentportal', function () {
    return Inertia::render('Student Portal/Profile');
})->name('profile');


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
        return Inertia::render('MCC/News/Index');
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

require __DIR__.'/auth.php';
