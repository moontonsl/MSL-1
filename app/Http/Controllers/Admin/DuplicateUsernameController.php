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
        // Increase time limit to prevent timeout
        set_time_limit(300); // 5 minutes
        
        try {
            // Use chunking to handle large datasets and prevent timeouts
            $duplicateResults = [];
            $emailsSent = 0;
            $processedUsers = 0;
            
            // Process users in chunks to avoid memory issues and timeouts
            User::select('id', 'name', 'surname', 'username', 'email')
                ->whereNotNull('username')
                ->where('username', '!=', '')
                ->chunk(500, function ($users) use (&$duplicateResults, &$emailsSent, &$processedUsers) {
                    $processedUsers += $users->count();
                    
                    // Group users by username to find duplicates
                    $usernameGroups = $users->groupBy('username');
                    
                    // Filter only groups with more than one user (duplicates)
                    $duplicates = $usernameGroups->filter(function ($group) {
                        return $group->count() > 1;
                    });
                    
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
                        
                        // Send email to each user with duplicate username (limit to prevent timeout)
                        foreach ($users as $user) {
                            if ($emailsSent < 20) { // Limit emails per request to prevent timeout
                                if($user->username == "usernametest"){
                                    echo "dito jabilat ". "<br>";
                                    try {
                                        Mail::to($user->email)->send(new DuplicateUsernameNotification($user));
                                        $emailsSent++;
                                    } catch (\Exception $e) {
                                        \Log::error('Failed to send duplicate username email to: ' . $user->email . ' - ' . $e->getMessage());
                                    }
                                }
                               
                            }
                        }
                    }
                });

            return response()->json([
                'success' => true,
                'duplicates' => $duplicateResults,
                'emails_sent' => $emailsSent,
                'processed_users' => $processedUsers,
                'message' => 'Found ' . count($duplicateResults) . ' duplicate username(s) and sent ' . $emailsSent . ' notification email(s). Processed ' . $processedUsers . ' users.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
} 