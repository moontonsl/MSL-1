# ML ID Helper Functions

This document describes the global helper functions created to check if an `ml_id` is already used in other accounts in the users table.

## Overview

The helper functions are located in `app/helpers.php` and are automatically loaded by Composer. These functions can be used anywhere in your Laravel application to validate ML ID uniqueness.

## Available Functions

### 1. `is_ml_id_used(string $mlId, ?int $excludeUserId = null): bool`

Checks if an `ml_id` is already used by other accounts.

**Parameters:**
- `$mlId` (string): The ML ID to check
- `$excludeUserId` (int|null): Optional user ID to exclude from the check (useful for updates)

**Returns:** `bool` - `true` if ML ID is already used, `false` otherwise

**Example:**
```php
// Check if ML ID is used by any account
if (is_ml_id_used('123456789')) {
    echo "ML ID is already registered";
}

// Check if ML ID is used by other accounts (excluding current user)
if (is_ml_id_used('123456789', $currentUserId)) {
    echo "ML ID is used by another account";
}
```

### 2. `is_ml_id_available(string $mlId, ?int $excludeUserId = null): bool`

Checks if an `ml_id` is available for use.

**Parameters:**
- `$mlId` (string): The ML ID to check
- `$excludeUserId` (int|null): Optional user ID to exclude from the check

**Returns:** `bool` - `true` if ML ID is available, `false` if already used

**Example:**
```php
// Check if ML ID is available for registration
if (is_ml_id_available('123456789')) {
    echo "ML ID is available for registration";
}
```

### 3. `get_user_by_ml_id(string $mlId): ?User`

Gets the user who owns the specified `ml_id`.

**Parameters:**
- `$mlId` (string): The ML ID to find

**Returns:** `User|null` - The user object or `null` if not found

**Example:**
```php
$user = get_user_by_ml_id('123456789');
if ($user) {
    echo "User found: " . $user->name;
} else {
    echo "No user found with this ML ID";
}
```

### 4. `validate_ml_id_uniqueness(string $mlId, ?int $excludeUserId = null): array`

Validates ML ID uniqueness and returns a structured validation result.

**Parameters:**
- `$mlId` (string): The ML ID to validate
- `$excludeUserId` (int|null): Optional user ID to exclude from validation

**Returns:** `array` - Array with `valid` boolean and `message` string

**Example:**
```php
$validation = validate_ml_id_uniqueness('123456789', $currentUserId);
if ($validation['valid']) {
    echo $validation['message']; // "ML ID is available."
} else {
    echo $validation['message']; // "This ML ID is already registered with another account."
}
```

## Usage Examples

### In Controllers

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $mlId = $request->input('ml_id');
        
        // Check if ML ID is available
        if (!is_ml_id_available($mlId)) {
            return back()->withErrors(['ml_id' => 'This ML ID is already registered.']);
        }
        
        // Proceed with registration
        // ...
    }
    
    public function update(Request $request, $userId)
    {
        $mlId = $request->input('ml_id');
        
        // Check if ML ID is available (excluding current user)
        if (!is_ml_id_available($mlId, $userId)) {
            return back()->withErrors(['ml_id' => 'This ML ID is already registered by another account.']);
        }
        
        // Proceed with update
        // ...
    }
}
```

### In Validation Rules

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function rules()
    {
        $userId = $this->route('user'); // For updates
        
        return [
            'ml_id' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use ($userId) {
                    if (!is_ml_id_available($value, $userId)) {
                        $fail('This ML ID is already registered with another account.');
                    }
                },
            ],
        ];
    }
}
```

### In Blade Templates

```php
@if(is_ml_id_used($user->ml_id))
    <span class="text-red-500">ML ID is already registered</span>
@else
    <span class="text-green-500">ML ID is available</span>
@endif
```

### In API Responses

```php
public function checkMlIdAvailability(Request $request)
{
    $mlId = $request->input('ml_id');
    $userId = $request->input('user_id');
    
    $validation = validate_ml_id_uniqueness($mlId, $userId);
    
    return response()->json([
        'available' => $validation['valid'],
        'message' => $validation['message']
    ]);
}
```

## Class-Based Helper

You can also use the class-based helper `App\Helpers\UserHelper`:

```php
use App\Helpers\UserHelper;

// Check if ML ID is used
if (UserHelper::isMlIdAlreadyUsed('123456789')) {
    // Handle duplicate ML ID
}

// Get user by ML ID
$user = UserHelper::getUserByMlId('123456789');

// Check availability
if (UserHelper::isMlIdAvailable('123456789')) {
    // ML ID is available
}
```

## Database Structure

The functions work with the `users` table which has the following relevant columns:
- `id` (primary key)
- `ml_id` (string, nullable)
- Other user fields...

## Performance Considerations

- The functions use Laravel's Eloquent ORM with `exists()` method for efficient database queries
- Consider adding database indexes on the `ml_id` column for better performance
- For high-traffic applications, consider implementing caching

## Error Handling

The functions handle edge cases:
- Empty or null ML IDs
- Non-existent users
- Database connection issues (will throw exceptions)

## Testing

You can test these functions in your Laravel application:

```php
// In a test file
public function test_ml_id_availability()
{
    // Create a user with ML ID
    $user = User::factory()->create(['ml_id' => '123456789']);
    
    // Test that ML ID is marked as used
    $this->assertTrue(is_ml_id_used('123456789'));
    $this->assertFalse(is_ml_id_available('123456789'));
    
    // Test exclusion
    $this->assertFalse(is_ml_id_used('123456789', $user->id));
    $this->assertTrue(is_ml_id_available('123456789', $user->id));
}
```

## Installation

The helper functions are automatically loaded when you run:
```bash
composer dump-autoload
```

The `app/helpers.php` file is registered in `composer.json` under the autoload files section. 