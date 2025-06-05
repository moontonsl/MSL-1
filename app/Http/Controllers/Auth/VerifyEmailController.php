<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
// jabu
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
    public function sendCode(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email'
            ]);
    
            $code = rand(100000, 999999);
            Cache::put('verification_code_' . $request->email, $code, now()->addMinutes(10));
    
            Mail::raw("Your verification code is: $code", function($message) use ($request) {
                $message->to($request->email)
                        ->subject('Your Verification Code');
            });
    
            return response()->json(['message' => 'Verification code sent!']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
