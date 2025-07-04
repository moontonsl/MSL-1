<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\AuthController;
use Illuminate\Support\Facades\Route;

// Admin Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'login'])->name('admin.login.submit');
});

// Protected Admin Routes
Route::middleware(['auth:admin', 'admin'])->group(function () {
    // Logout Route
    Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

    // Dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // User Management
    Route::get('/admin/users/pending', [AdminController::class, 'pendingUsers'])->name('admin.users.pending');
    Route::post('/admin/users/{user}/verify', [AdminController::class, 'verifyUser'])->name('admin.users.verify');

    // News Management
    Route::get('/admin/news', [AdminController::class, 'manageNews'])->name('admin.news');
    Route::get('/admin/news/create', [AdminController::class, 'createNews'])->name('admin.news.create');
    Route::post('/admin/news', [AdminController::class, 'storeNews'])->name('admin.news.store');
    Route::get('/admin/news/{news}/edit', [AdminController::class, 'editNews'])->name('admin.news.edit');
    Route::put('/admin/news/{news}', [AdminController::class, 'updateNews'])->name('admin.news.update');
    Route::delete('/admin/news/{news}', [AdminController::class, 'deleteNews'])->name('admin.news.delete');

    // Event Management
    Route::get('/admin/events', [AdminController::class, 'manageEvents'])->name('admin.events');
    Route::get('/admin/events/create', [AdminController::class, 'createEvent'])->name('admin.events.create');
    Route::post('/admin/events', [AdminController::class, 'storeEvent'])->name('admin.events.store');
    Route::get('/admin/events/{event}/edit', [AdminController::class, 'editEvent'])->name('admin.events.edit');
    Route::put('/admin/events/{event}', [AdminController::class, 'updateEvent'])->name('admin.events.update');
    Route::delete('/admin/events/{event}', [AdminController::class, 'deleteEvent'])->name('admin.events.delete');

    // Settings Management
    Route::get('/admin/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('admin.settings');
    Route::post('/admin/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update']);
});