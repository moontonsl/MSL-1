<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::domain('awards.testing.moontonslph.org')->group(function () {
    Route::get('/', function () {
        return redirect('/MSLNetworkAwards');
    });

    Route::get('/MSLNetworkAwards', function () {
        return Inertia::render('Awards/NetworkAwards');
    })->name('awards-subdomain.network.awards');

    Route::get('/MSLNetworkAwards/Organization', function () {
        return Inertia::render('Awards/OrganizationAwards', [
            'isMlAuthenticated' => session()->has('ml_user')
        ]);
    })->name('awards-subdomain.network.awards.organization');

    Route::get('/MSLNetworkAwards/Individual', function () {
        return Inertia::render('Awards/IndividualAwards', [
            'isMlAuthenticated' => session()->has('ml_user')
        ]);
    })->name('awards-subdomain.network.awards.individual');

    Route::get('/MSLNetworkAwards/Nominate/{awardId}', function (string $awardId) {
        $isMlAuthenticated = session()->has('ml_user');
        $fullName = '';
        $isReadOnly = false;

        if (session()->has('ml_user')) {
            $mlUser = session('ml_user');
            $user = \App\Models\User::where('ml_id', $mlUser->ml_id)->first();
            if ($user) {
                $fullName = trim($user->name . ' ' . $user->surname);
                $isReadOnly = true;
            }
        }

        return Inertia::render('Awards/AwardNominationForm', [
            'awardId' => $awardId,
            'prefilledName' => $fullName,
            'isNameReadOnly' => $isReadOnly,
            'isMlAuthenticated' => $isMlAuthenticated,
        ]);
    })->name('awards-subdomain.network.awards.nominate');

    Route::get('/MSLNetworkAwards/NominateStudent/{awardId}', function (string $awardId) {
        $isMlAuthenticated = session()->has('ml_user');
        $fullName = '';
        $isReadOnly = false;

        if (session()->has('ml_user')) {
            $mlUser = session('ml_user');
            $user = \App\Models\User::where('ml_id', $mlUser->ml_id)->first();
            if ($user) {
                $fullName = trim($user->name . ' ' . $user->surname);
                $isReadOnly = true;
            }
        }

        return Inertia::render('Awards/StudentAwardNominationForm', [
            'awardId' => $awardId,
            'prefilledName' => $fullName,
            'isNameReadOnly' => $isReadOnly,
            'isMlAuthenticated' => $isMlAuthenticated,
        ]);
    })->name('awards-subdomain.network.awards.nominate.student');

    // Backwards-compatible redirects
    Route::redirect('/NetworkAwards', '/MSLNetworkAwards', 301);
    Route::redirect('/NetworkAwards/Organization', '/MSLNetworkAwards/Organization', 301);
    Route::redirect('/NetworkAwards/Individual', '/MSLNetworkAwards/Individual', 301);
    Route::redirect('/NetworkAwards/Nominate/{awardId}', '/MSLNetworkAwards/Nominate/{awardId}', 301);
    Route::redirect('/NetworkAwards/NominateStudent/{awardId}', '/MSLNetworkAwards/NominateStudent/{awardId}', 301);
});

Route::domain('awards.moontonslph.org')->group(function () {
    Route::get('/', function () {
        return redirect('/MSLNetworkAwards');
    });

    Route::get('/MSLNetworkAwards', function () {
        return Inertia::render('Awards/NetworkAwards');
    })->name('awards-subdomain.network.awards.prod');

    Route::get('/MSLNetworkAwards/Organization', function () {
        return Inertia::render('Awards/OrganizationAwards', [
            'isMlAuthenticated' => session()->has('ml_user')
        ]);
    })->name('awards-subdomain.network.awards.organization.prod');

    Route::get('/MSLNetworkAwards/Individual', function () {
        return Inertia::render('Awards/IndividualAwards', [
            'isMlAuthenticated' => session()->has('ml_user')
        ]);
    })->name('awards-subdomain.network.awards.individual.prod');

    Route::get('/MSLNetworkAwards/Nominate/{awardId}', function (string $awardId) {
        $isMlAuthenticated = session()->has('ml_user');
        $fullName = '';
        $isReadOnly = false;

        if (session()->has('ml_user')) {
            $mlUser = session('ml_user');
            $user = \App\Models\User::where('ml_id', $mlUser->ml_id)->first();
            if ($user) {
                $fullName = trim($user->name . ' ' . $user->surname);
                $isReadOnly = true;
            }
        }

        return Inertia::render('Awards/AwardNominationForm', [
            'awardId' => $awardId,
            'prefilledName' => $fullName,
            'isNameReadOnly' => $isReadOnly,
            'isMlAuthenticated' => $isMlAuthenticated,
        ]);
    })->name('awards-subdomain.network.awards.nominate.prod');

    Route::get('/MSLNetworkAwards/NominateStudent/{awardId}', function (string $awardId) {
        $isMlAuthenticated = session()->has('ml_user');
        $fullName = '';
        $isReadOnly = false;

        if (session()->has('ml_user')) {
            $mlUser = session('ml_user');
            $user = \App\Models\User::where('ml_id', $mlUser->ml_id)->first();
            if ($user) {
                $fullName = trim($user->name . ' ' . $user->surname);
                $isReadOnly = true;
            }
        }

        return Inertia::render('Awards/StudentAwardNominationForm', [
            'awardId' => $awardId,
            'prefilledName' => $fullName,
            'isNameReadOnly' => $isReadOnly,
            'isMlAuthenticated' => $isMlAuthenticated,
        ]);
    })->name('awards-subdomain.network.awards.nominate.student.prod');
});
