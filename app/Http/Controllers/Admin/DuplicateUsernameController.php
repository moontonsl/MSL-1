<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\DuplicateUsernameNotification;
use Illuminate\Support\Facades\DB;

class DuplicateUsernameController extends Controller
{
    /**
     * Check all users for duplicate usernames.
     */
    public function checkDuplicates(): JsonResponse
    {
        // Increase time limit to prevent timeout
        set_time_limit(0); // 5 minutes
        
        try {
            // Use SQL to find all duplicate usernames across the entire database
            $duplicateUsernames = DB::select("
                SELECT username, COUNT(*) as duplicate_count
                FROM users 
                WHERE username IS NOT NULL 
                AND username != ''
                GROUP BY username 
                HAVING COUNT(*) > 1
                ORDER BY duplicate_count DESC
            ");
            
            $duplicateResults = [];
            $emailsSent = 0;
            $totalDuplicateUsers = 0;
            
            foreach ($duplicateUsernames as $duplicate) {
                // Get all users with this duplicate username
                $users = User::where('username', $duplicate->username)
                    ->select('id', 'name', 'surname', 'username', 'email')
                    ->get();
                
                $duplicateResults[] = [
                    'username' => $duplicate->username,
                    'count' => $duplicate->duplicate_count,
                    'users' => $users->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->name . ' ' . $user->surname,
                            'email' => $user->email,
                        ];
                    })->toArray()
                ];
                
                $totalDuplicateUsers += $duplicate->duplicate_count;
                
                // Send email to each user with duplicate username (limit to prevent timeout)
                foreach ($users as $user) {
                    // if ($emailsSent < 20) { // Limit emails per request to prevent timeout
                    //     try {
                    //         Mail::to($user->email)->send(new DuplicateUsernameNotification($user));
                    //         $emailsSent++;
                    //     } catch (\Exception $e) {
                    //         \Log::error('Failed to send duplicate username email to: ' . $user->email . ' - ' . $e->getMessage());
                    //     }
                    // }
                }
            }

            return response()->json([
                'success' => true,
                // 'duplicates' => $duplicateResults,
                'total_duplicate_usernames' => count($duplicateUsernames),
                'total_duplicate_users' => $totalDuplicateUsers,
                'emails_sent' => $emailsSent,
                'message' => 'Found ' . count($duplicateUsernames) . ' duplicate username(s) affecting ' . $totalDuplicateUsers . ' users and sent ' . $emailsSent . ' notification email(s).'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
} 