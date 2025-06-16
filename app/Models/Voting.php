<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voting extends Model
{
    protected $fillable = [
        'user_id',
        'image',
        'bracket',
        'team',
        'status',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'created_at' => 'datetime'
    ];

    /**
     * Check if a user has voted for a specific bracket
     *
     * @param int $userId
     * @param string $bracket
     * @return bool
     */
    public static function hasUserVotedForBracket($userId, $bracket)
    {
        return self::where('user_id', $userId)
            ->where('bracket', $bracket)
            ->exists();
    }

    /**
     * Get all votes for a user in a specific bracket
     *
     * @param int $userId
     * @param string $bracket
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUserVotesForBracket($userId, $bracket)
    {
        return self::where('user_id', $userId)
            ->where('bracket', $bracket)
            ->get();
    }
} 