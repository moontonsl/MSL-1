# ML Users IGN Update - CRON Job Setup

This document explains how to set up the automated IGN (In-Game Name) update job for ML users.

## Overview

The `ml-users:update-ign` command updates the IGN column in the `ml_users` table by fetching the latest username from the Codashop API for each user.

## Command Usage

### Manual Execution

Run the command manually:

```bash
php artisan ml-users:update-ign
```

### Options

- `--limit=N`: Limit the number of users to process (useful for testing)
- `--dry-run`: Run without making any database changes (useful for testing)

### Examples

```bash
# Test with 5 users (dry run)
php artisan ml-users:update-ign --dry-run --limit=5

# Update first 10 users
php artisan ml-users:update-ign --limit=10

# Update all users
php artisan ml-users:update-ign
```

## Scheduled Task Configuration

The command is scheduled to run **weekly on Sundays at 2:00 AM** in `routes/console.php`.

## CRON Setup

To enable the Laravel task scheduler, you need to add a single CRON entry that runs every minute:

### 1. Edit your crontab

```bash
crontab -e
```

### 2. Add the following line

```bash
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```

**Important:** Replace `/path/to/your/project` with the actual path to your Laravel project.

### Example

If your project is at `/home/moontonslph.org/laravel-app`, the CRON entry would be:

```bash
* * * * * cd /home/moontonslph.org/laravel-app && php artisan schedule:run >> /dev/null 2>&1
```

### 3. Verify CRON is running

Check if the CRON job is active:

```bash
crontab -l
```

## How It Works

1. The scheduler runs `php artisan schedule:run` every minute
2. Laravel checks if any scheduled tasks are due to run
3. The `ml-users:update-ign` command runs weekly on Sundays at 2:00 AM
4. For each user in `ml_users` table:
   - Fetches username from Codashop API using `ml_id` and `server_id`
   - Compares with current `ign` value
   - Updates `ign` if different
5. All actions are logged to `storage/logs/laravel.log`

## Monitoring

### Check Logs

```bash
tail -f storage/logs/laravel.log | grep "ML User"
```

### Test the Scheduler

```bash
# Run the scheduler manually (will execute due tasks)
php artisan schedule:run

# List all scheduled tasks
php artisan schedule:list
```

## Customizing the Schedule

To change when the command runs, edit `routes/console.php`:

```php
// Run every 6 hours
Schedule::command('ml-users:update-ign')
    ->everySixHours()
    ->withoutOverlapping();

// Run every day at a different time
Schedule::command('ml-users:update-ign')
    ->dailyAt('03:00')
    ->withoutOverlapping();

// Run weekly
Schedule::command('ml-users:update-ign')
    ->weekly()
    ->withoutOverlapping();
```

## Troubleshooting

### Command not found

Make sure you're in the project root directory and run:

```bash
php artisan list | grep ml-users
```

### CRON not running

1. Check if CRON service is running:
   ```bash
   sudo systemctl status cron
   ```

2. Check CRON logs:
   ```bash
   grep CRON /var/log/syslog
   ```

3. Verify the path in crontab is correct

### Rate Limiting

The command includes a 0.5 second delay between API calls to avoid rate limiting. If you encounter rate limits, you can:

1. Process fewer users at a time using `--limit`
2. Increase the delay in the command code
3. Run the command less frequently

