<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NewsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
//jabu
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Models\User;
use App\Http\Controllers\Auth\VerifyEmailController;

Route::get('/', function () {
    return Inertia::render('Home/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


//LOGIN ROUTES
Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');
// Route::post('/login2', [AuthController::class, 'login'])->name('login2');

//ACCOUNT REGISTRATION ROUTES
Route::get('/register', function () {
    return Inertia::render('Account Creation/Register');
})->name('register');


//STUDENT PORTAL
Route::get('/studentportal', function () {
    return Inertia::render('Student Portal/Profile');
})->middleware(['auth', 'verified'])->name('profile');

// MCC Routes
Route::get('/mcc', function () {
    return Inertia::render('MCC/Main Page/index');
})->name('mcc.main');

Route::get('/mcc/calendar', function () {
    return Inertia::render('MCC/Calendar/index');
})->name('mcc.calendar');

// MCC Voting Routes
Route::prefix('mcc/voting')->name('mcc.voting.')->group(function () {
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';