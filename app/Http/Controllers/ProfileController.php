<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User; // Added this import for User model

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        try {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);

            $user = $request->user();
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Log the deletion attempt
            \Log::info('Attempting to delete user account', ['user_id' => $user->id, 'email' => $user->email]);

            // Handle relationships before deletion to avoid foreign key constraints
            // Clear verified_by references to this user
            User::where('verified_by', $user->id)->update(['verified_by' => null]);
            
            // Delete the user
            $deleted = $user->delete();
            
            if (!$deleted) {
                \Log::error('Failed to delete user account', ['user_id' => $user->id]);
                return response()->json(['error' => 'Failed to delete account'], 500);
            }

            // Log successful deletion
            \Log::info('User account deleted successfully', ['user_id' => $user->id]);

            // Logout and clear session
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Return JSON response instead of redirecting
            // This allows the frontend to handle the redirect after showing success modal
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Account deleted successfully',
                    'deleted' => true
                ]);
            }

            // Fallback redirect for non-AJAX requests
            return Redirect::to('/');
            
        } catch (\Exception $e) {
            \Log::error('Error deleting user account', [
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Failed to delete account: ' . $e->getMessage()], 500);
            }
            
            return Redirect::back()->withErrors(['error' => 'Failed to delete account']);
        }
    }
}
