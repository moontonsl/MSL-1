<?php

namespace App\Http\Controllers;

use App\Jobs\SendFaultyUsernameEmails;
use App\Mail\FaultyUsernameMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class FaultyUsernameController extends Controller
{
    /**
     * Display the faulty username management panel
     */
    public function index(Request $request)
    {
        $issueType = $request->get('issue_type', 'all');
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search');

        // Get users with faulty usernames
        $query = $this->buildQuery($issueType);
        
        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('surname', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('username', 'like', '%' . $search . '%')
                  ->orWhere(DB::raw("CONCAT(name, ' ', COALESCE(surname, ''))"), 'like', '%' . $search . '%');
            });
        }
        
        $faultyUsers = $query->paginate($perPage);

        // Add issue type to each user
        $faultyUsers->getCollection()->transform(function ($user) {
            $user->issue_type = $this->determineIssueType($user);
            $user->username_length = strlen($user->username ?? '');
            return $user;
        });

        // Get statistics
        $stats = $this->getFaultyUsernameStats();

        return view('admin.faulty-username', compact('faultyUsers', 'stats', 'issueType', 'search'));
    }

    /**
     * Send email to a specific user
     */
    public function sendEmailToUser(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            $issueType = $this->determineIssueType($user);
            
            if ($issueType) {
                Mail::to($user->email)->send(new FaultyUsernameMail($user, $issueType));
                
                return response()->json([
                    'success' => true,
                    'message' => "Email sent successfully to {$user->name} ({$user->email})"
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'No username issue found for this user'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Send emails to selected users
     */
    public function sendEmailToSelected(Request $request)
    {
        $userIds = $request->input('user_ids', []);
        
        if (empty($userIds)) {
            return response()->json([
                'success' => false,
                'message' => 'No users selected'
            ]);
        }

        try {
            // Send emails immediately instead of queueing
            $successCount = 0;
            $errorCount = 0;
            
            foreach ($userIds as $userId) {
                try {
                    $user = User::find($userId);
                    if ($user) {
                        $issueType = $this->determineIssueType($user);
                        if ($issueType) {
                            Mail::to($user->email)->send(new FaultyUsernameMail($user, $issueType));
                            $successCount++;
                        }
                    }
                } catch (\Exception $e) {
                    $errorCount++;
                }
            }
            
            $message = "Sent emails to {$successCount} users.";
            if ($errorCount > 0) {
                $message .= " {$errorCount} failed.";
            }
            
            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send emails: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Send emails to all users with faulty usernames
     */
    public function sendEmailToAll(Request $request)
    {
        $issueType = $request->input('issue_type', 'all');
        
        try {
            $query = $this->buildQuery($issueType);
            $userIds = $query->pluck('id')->toArray();
            
            if (empty($userIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No users found with the specified issue type'
                ]);
            }

            // Send emails immediately
            $successCount = 0;
            $errorCount = 0;
            
            foreach ($userIds as $userId) {
                try {
                    $user = User::find($userId);
                    if ($user) {
                        $issueType = $this->determineIssueType($user);
                        if ($issueType) {
                            Mail::to($user->email)->send(new FaultyUsernameMail($user, $issueType));
                            $successCount++;
                        }
                    }
                } catch (\Exception $e) {
                    $errorCount++;
                }
            }
            
            $message = "Sent emails to {$successCount} users.";
            if ($errorCount > 0) {
                $message .= " {$errorCount} failed.";
            }
            
            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to queue emails: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get statistics for the dashboard
     */
    public function getStats()
    {
        $stats = $this->getFaultyUsernameStats();
        return response()->json($stats);
    }

    /**
     * Build query based on issue type
     */
    private function buildQuery(string $issueType)
    {
        $query = User::select('id', 'name', 'surname', 'email', 'username', 'created_at')
                    ->orderBy('created_at', 'desc');

        switch ($issueType) {
            case 'short':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->where(DB::raw('CHAR_LENGTH(username)'), '<=', 3);
                });

            case 'spaces':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->where('username', 'LIKE', '% %');
                });

            case 'long':
                return $query->where(function ($q) {
                    $q->whereNotNull('username')
                      ->where(DB::raw('CHAR_LENGTH(username)'), '>', 15);
                });

            case 'empty':
                return $query->where(function ($q) {
                    $q->whereNull('username')
                      ->orWhere('username', '')
                      ->orWhere(DB::raw('TRIM(username)'), '');
                });

            case 'all':
            default:
                return $query->where(function ($q) {
                    $q->whereNull('username')
                      ->orWhere('username', '')
                      ->orWhere(DB::raw('TRIM(username)'), '')
                      ->orWhere(DB::raw('CHAR_LENGTH(username)'), '<=', 3)
                      ->orWhere('username', 'LIKE', '% %')
                      ->orWhere(DB::raw('CHAR_LENGTH(username)'), '>', 15);
                });
        }
    }

    /**
     * Determine the type of username issue
     */
    private function determineIssueType(User $user): ?string
    {
        $username = $user->username;

        if (is_null($username) || trim($username) === '') {
            return 'Empty/NULL username';
        }

        if (strlen($username) <= 3) {
            return 'Too short (≤3 chars)';
        }

        if (strpos($username, ' ') !== false) {
            return 'Contains spaces';
        }

        if (strlen($username) > 15) {
            return 'Too long (>15 chars)';
        }

        return null;
    }

    /**
     * Get statistics about faulty usernames
     */
    private function getFaultyUsernameStats(): array
    {
        $stats = [
            'empty_count' => 0,
            'short_count' => 0,
            'spaces_count' => 0,
            'long_count' => 0,
            'total_faulty' => 0,
            'total_users' => 0,
        ];

        // Get total users count
        $stats['total_users'] = User::count();

        // Count each type of issue
        $stats['empty_count'] = User::where(function ($query) {
            $query->whereNull('username')
                  ->orWhere('username', '')
                  ->orWhere(DB::raw('TRIM(username)'), '');
        })->count();

        $stats['short_count'] = User::whereNotNull('username')
                                   ->where(DB::raw('CHAR_LENGTH(username)'), '<=', 3)
                                   ->count();

        $stats['spaces_count'] = User::whereNotNull('username')
                                    ->where('username', 'LIKE', '% %')
                                    ->count();

        $stats['long_count'] = User::whereNotNull('username')
                                  ->where(DB::raw('CHAR_LENGTH(username)'), '>', 15)
                                  ->count();

        // Calculate total faulty
        $stats['total_faulty'] = User::where(function ($query) {
            $query->whereNull('username')
                  ->orWhere('username', '')
                  ->orWhere(DB::raw('TRIM(username)'), '')
                  ->orWhere(DB::raw('CHAR_LENGTH(username)'), '<=', 3)
                  ->orWhere('username', 'LIKE', '% %')
                  ->orWhere(DB::raw('CHAR_LENGTH(username)'), '>', 15);
        })->count();

        return $stats;
    }
} 