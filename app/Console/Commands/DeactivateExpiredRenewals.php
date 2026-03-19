<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class DeactivateExpiredRenewals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:deactivate-expired-renewals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deactivate users who have been in the Renew state for over 6 months';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find users in 'Renew' state where the last updated_at is older than 6 months
        $expiredUsers = User::where('state', 'Renew')
            ->where('status', 'active') // Only target currently active users
            ->where('updated_at', '<=', Carbon::now()->subMonths(6))
            ->get();

        $count = $expiredUsers->count();

        foreach ($expiredUsers as $user) {
            $user->update([
                'status' => 'inactive'
            ]);
            
            $this->info("Deactivated user {$user->username} (ID: {$user->id}).");
        }

        if ($count > 0) {
            $this->info("Successfully deactivated {$count} expired renew users.");
        } else {
            $this->info("No expired renew users found.");
        }
    }
}
