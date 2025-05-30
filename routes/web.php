<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NewsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

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
 
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
