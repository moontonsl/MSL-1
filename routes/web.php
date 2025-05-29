<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


//Route::get('/', function () {
//    return Inertia::render('Home/Home');
//});



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


//ACCOUNT ROUTES
Route::get('/register', function () {
    return Inertia::render('Account Creation/Register');
})->name('register');


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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

