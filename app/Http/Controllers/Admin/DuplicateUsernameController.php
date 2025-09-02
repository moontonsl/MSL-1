<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\DuplicateUsernameNotification;

class DuplicateUsernameController extends Controller
{
    /**
     * Check all users for duplicate usernames.
     */
    public function checkDuplicates(): JsonResponse
    {
        try {
            // Get all users with usernames
            $users = User::select('id', 'name', 'surname', 'username', 'email')
                ->whereNotNull('username')
                ->where('username', '!=', '')
                ->get();

            // Group users by username to find duplicates
            $usernameGroups = $users->groupBy('username');
            
            // Filter only groups with more than one user (duplicates)
            $duplicates = $usernameGroups->filter(function ($group) {
                return $group->count() > 1;
            });

            // Format the results and send emails
            $duplicateResults = [];
            $emailsSent = 0;
            
            foreach ($duplicates as $username => $users) {
                $duplicateResults[] = [
                    'username' => $username,
                    'count' => $users->count(),
                    'users' => $users->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->name . ' ' . $user->surname,
                            'email' => $user->email,
                        ];
                    })->toArray()
                ];
                
                // Send email to each user with duplicate username
                foreach ($users as $user) {
                    if($user->username == "usernametest"){
                        echo "dito jabilat ". "<br>";
                        try {
                            echo "meron";
                            Mail::to($user->email)->send(new DuplicateUsernameNotification($user));
                            $emailsSent++;
                        } catch (\Exception $e) {
                            echo "wala";
                            // Log email sending errors but continue processing
                            // \Log::error('Failed to send duplicate username email to: ' . $user->email . ' - ' . $e->getMessage());
                        }
                    }
                    // try {
                    //     Mail::to($user->email)->send(new DuplicateUsernameNotification($user));
                    //     $emailsSent++;
                    // } catch (\Exception $e) {
                    //     // Log email sending errors but continue processing
                    //     \Log::error('Failed to send duplicate username email to: ' . $user->email . ' - ' . $e->getMessage());
                    // }
                }
            }
            dd($duplicateResults);
            return response()->json([
                'success' => true,
                'duplicates' => $duplicateResults,
                'emails_sent' => $emailsSent,
                'message' => 'Found ' . count($duplicateResults) . ' duplicate username(s) and sent ' . $emailsSent . ' notification email(s).'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
} 