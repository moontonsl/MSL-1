<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use Illuminate\Support\Facades\Route;

// Admin Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
    Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login.submit');
});

// Protected Admin Routes
Route::middleware(['auth:admin', 'admin'])->group(function () {
    // Logout Route
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

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

    // Carousel Management
    Route::get('/admin/carousel', [AdminController::class, 'manageCarousel'])->name('admin.carousel');
    Route::post('/admin/carousel', [AdminController::class, 'storeCarousel'])->name('admin.carousel.store');
    Route::put('/admin/carousel/{carousel}', [AdminController::class, 'updateCarousel'])->name('admin.carousel.update');
    Route::delete('/admin/carousel/{carousel}', [AdminController::class, 'deleteCarousel'])->name('admin.carousel.delete');
    Route::post('/admin/carousel/reorder', [AdminController::class, 'reorderCarousel'])->name('admin.carousel.reorder');

    // Event Photos Management
    Route::get('/admin/event-photos', [AdminController::class, 'manageEventPhotos'])->name('admin.event-photos');
    Route::post('/admin/event-photos', [AdminController::class, 'storeEventPhoto'])->name('admin.event-photos.store');
    Route::put('/admin/event-photos/{eventPhoto}', [AdminController::class, 'updateEventPhoto'])->name('admin.event-photos.update');
    Route::delete('/admin/event-photos/{eventPhoto}', [AdminController::class, 'deleteEventPhoto'])->name('admin.event-photos.delete');

    // Event Management
    Route::get('/admin/events', [AdminController::class, 'manageEvents'])->name('admin.events');
    Route::get('/admin/events/create', [AdminController::class, 'createEvent'])->name('admin.events.create');
    Route::post('/admin/events', [AdminController::class, 'storeEvent'])->name('admin.events.store');
    Route::get('/admin/events/{event}/edit', [AdminController::class, 'editEvent'])->name('admin.events.edit');
    Route::put('/admin/events/{event}', [AdminController::class, 'updateEvent'])->name('admin.events.update');
    Route::delete('/admin/events/{event}', [AdminController::class, 'deleteEvent'])->name('admin.events.delete');

    // MSL Event Management
    Route::get('/admin/msl-events', [AdminController::class, 'mslEventIndex'])->name('admin.msl-events.index');
    Route::get('/admin/msl-events/create', [AdminController::class, 'mslEventCreate'])->name('admin.msl-events.create');
    Route::post('/admin/msl-events', [AdminController::class, 'storeMslEvent'])->name('admin.msl-events.store');
    Route::get('/admin/msl-events/{mslEvent}/edit', [AdminController::class, 'mslEventEdit'])->name('admin.msl-events.edit');
    Route::put('/admin/msl-events/{mslEvent}', [AdminController::class, 'updateMslEvent'])->name('admin.msl-events.update');
    Route::put('/admin/msl-events/{mslEvent}/status', [AdminController::class, 'updateMslEventStatus'])->name('admin.msl-events.update-status');
    Route::delete('/admin/msl-events/{mslEvent}', [AdminController::class, 'destroyMslEvent'])->name('admin.msl-events.destroy');

    // Settings Management
    Route::get('/admin/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('admin.settings');
    Route::post('/admin/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update']);

    // Duplicate Username Check
    Route::get('/admin/duplicate-usernames/check', [\App\Http\Controllers\Admin\DuplicateUsernameController::class, 'checkDuplicates'])->name('admin.duplicate-usernames.check');

    // SL Management
    Route::get('/admin/sl-management', [AdminController::class, 'slManagement'])->name('admin.sl-management');
    Route::post('/admin/users/{user}/promote-sl', [AdminController::class, 'promoteToSL'])->name('admin.users.promote-sl');
    Route::post('/admin/users/{user}/demote-sl', [AdminController::class, 'demoteFromSL'])->name('admin.users.demote-sl');

    // Regional Admin Management
    Route::get('/admin/regional-admin-management', [AdminController::class, 'regionalAdminManagement'])->name('admin.regional-admin-management');
    Route::post('/admin/users/{user}/promote-regional-admin', [AdminController::class, 'promoteToRegionalAdmin'])->name('admin.users.promote-regional-admin');
    Route::post('/admin/users/{user}/demote-regional-admin', [AdminController::class, 'demoteFromRegionalAdmin'])->name('admin.users.demote-regional-admin');
});