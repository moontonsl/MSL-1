<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule the ML Users IGN update command
// Run weekly on Sunday at 2:00 AM
Schedule::command('ml-users:update-ign')
    ->weekly()
    ->sundays()
    ->at('02:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->onFailure(function () {
        \Log::error('ML Users IGN update scheduled task failed');
    })
    ->onSuccess(function () {
        \Log::info('ML Users IGN update scheduled task completed successfully');
    });
