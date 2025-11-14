<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User; // Added this import for User model
use App\Mail\EmailChangeVerificationMail;

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
    public function update(ProfileUpdateRequest $request)
    {
        try {
            $user = $request->user();
            $validatedData = $request->validated();
            $emailChanged = false;
            $emailVerificationSent = false;

            // Check if email is being changed
            if (isset($validatedData['email']) && $validatedData['email'] !== $user->email) {
                // Don't allow email changes without verification
                if (!$user->email_verification_code) {
                    if ($request->wantsJson() || $request->ajax()) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Please send a verification code first before changing your email'
                        ], 400);
                    }
                    return Redirect::back()->withErrors(['email' => 'Please send a verification code first before changing your email']);
                }
                
                // Check if verification code exists and is not expired
                if ($user->email_verification_code_expires_at < now()) {
                    if ($request->wantsJson() || $request->ajax()) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Verification code has expired. Please send a new code.'
                        ], 400);
                    }
                    return Redirect::back()->withErrors(['email' => 'Verification code has expired. Please send a new code.']);
                }
                
                // Parse the stored data to get the new email
                $storedData = explode('|', $user->email_verification_code);
                if (count($storedData) !== 2 || $storedData[0] !== $validatedData['email']) {
                    if ($request->wantsJson() || $request->ajax()) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Email does not match the verification code. Please send a new code.'
                        ], 400);
                    }
                    return Redirect::back()->withErrors(['email' => 'Email does not match the verification code. Please send a new code.']);
                }
                
                // Email is verified, update it
                $user->email = $validatedData['email'];
                $user->email_verified_at = now();
                $user->email_verification_code = null;
                $user->email_verification_code_expires_at = null;
                
                // Remove email from validated data since we're handling it separately
                unset($validatedData['email']);
            }

            // Check field restrictions before allowing changes
            if (isset($validatedData['squadName']) && $validatedData['squadName'] !== $user->squadName) {
                // Check if squad name can be changed (once per month)
                if ($user->squad_name_last_changed) {
                    $lastChanged = \Carbon\Carbon::parse($user->squad_name_last_changed);
                    $nextChangeDate = $lastChanged->addMonth();
                    
                    if (now() < $nextChangeDate) {
                        $daysLeft = now()->diffInDays($nextChangeDate, false);
                        $message = "Squad name can be changed again in {$daysLeft} day" . ($daysLeft !== 1 ? 's' : '');
                        
                        if ($request->wantsJson() || $request->ajax()) {
                            return response()->json([
                                'success' => false,
                                'message' => $message
                            ], 400);
                        }
                        return Redirect::back()->withErrors(['squadName' => $message]);
                    }
                }
            }
            
            if (isset($validatedData['year_level']) && $validatedData['year_level'] !== $user->year_level) {
                // Check if year level can be changed (once per year)
                if ($user->year_level_last_changed) {
                    $lastChanged = \Carbon\Carbon::parse($user->year_level_last_changed);
                    $nextChangeDate = $lastChanged->addYear();
                    
                    if (now() < $nextChangeDate) {
                        $daysLeft = now()->diffInDays($nextChangeDate, false);
                        $message = "Year level can be changed again in {$daysLeft} day" . ($daysLeft !== 1 ? 's' : '');
                        
                        if ($request->wantsJson() || $request->ajax()) {
                            return response()->json([
                                'success' => false,
                                'message' => $message
                            ], 400);
                        }
                        return Redirect::back()->withErrors(['year_level' => $message]);
                    }
                }
            }

            // Restrict MLBB account change (once per year) - only when ml_id or ml_server changes
            $isMlAccountChanging = (
                (isset($validatedData['ml_id']) && $validatedData['ml_id'] !== $user->ml_id) ||
                (isset($validatedData['ml_server']) && $validatedData['ml_server'] !== $user->ml_server)
            );
            
            // Check if ML ID is already used by another account (only if ml_id is changing)
            if (isset($validatedData['ml_id']) && $validatedData['ml_id'] !== $user->ml_id) {
                if (is_ml_id_used($validatedData['ml_id'], $user->id)) {
                    $message = 'This ML ID is already registered with another account.';
                    if ($request->wantsJson() || $request->ajax()) {
                        return response()->json([
                            'success' => false,
                            'message' => $message
                        ], 400);
                    }
                    return Redirect::back()->withErrors(['ml_id' => $message]);
                }
            }
            
            if ($isMlAccountChanging && $user->ml_account_last_changed) {
                $lastChanged = \Carbon\Carbon::parse($user->ml_account_last_changed);
                $nextChangeDate = $lastChanged->addYear();
                if (now() < $nextChangeDate) {
                    $daysLeft = now()->diffInDays($nextChangeDate, false);
                    $message = "MLBB account can be changed again in {$daysLeft} day" . ($daysLeft !== 1 ? 's' : '');
                    if ($request->wantsJson() || $request->ajax()) {
                        return response()->json([
                            'success' => false,
                            'message' => $message
                        ], 400);
                    }
                    return Redirect::back()->withErrors(['ml_account' => $message]);
                }
            }

            // Check for field changes and update timestamps
            $squadNameChanged = false;
            $yearLevelChanged = false;
            $mlAccountChanged = false;
            
            if (isset($validatedData['squadName']) && $validatedData['squadName'] !== $user->squadName) {
                $squadNameChanged = true;
                $user->squad_name_last_changed = now();
            }
            
            if (isset($validatedData['year_level']) && $validatedData['year_level'] !== $user->year_level) {
                $yearLevelChanged = true;
                $user->year_level_last_changed = now();
            }

            if ($isMlAccountChanging) {
                $mlAccountChanged = true;
                $user->ml_account_last_changed = now();
            }

            // Update other fields
            $user->fill($validatedData);
            $user->save();

            // Return JSON response for AJAX requests
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Profile updated successfully',
                    'user' => $user->fresh()
                ]);
            }

            // Return redirect for regular form submissions
            return Redirect::route('profile.edit');
        } catch (\Exception $e) {
            \Log::error('Profile update error', [
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage()
            ]);

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update profile',
                    'error' => $e->getMessage()
                ], 500);
            }

            return Redirect::back()->withErrors(['error' => 'Failed to update profile']);
        }
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
