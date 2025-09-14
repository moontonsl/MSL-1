<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, CanResetPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'ml_id',
        'ml_server',
        'ml_ign',
        'status',
        'user_type',
        'facebook_link',
        'surname',
        'lastName',
        'suffix',
        'birthday',
        'age',
        'gender',
        'contact_number',
        'course',
        'university',
        'year_level',
        'region',
        'island',
        'squadAbbreviation',
        'squadName',
        'inGameRole',
        'mainHero',
        'rank',
        'studentId',
        'proofOfEnrollment',
        'role',
        'state',
        'blocked_reason',
        'verified_by',
        'verified_date'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'verified_date' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user who verified this user
     */
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the users verified by this user
     */
    public function verifiedUsers()
    {
        return $this->hasMany(User::class, 'verified_by');
    }

    /**
     * Get the regions assigned to this user (for Regional Admins)
     */
    public function assignedRegions()
    {
        return $this->hasMany(UserRegion::class);
    }

    /**
     * Get the region names assigned to this user
     */
    public function getAssignedRegionNames()
    {
        return $this->assignedRegions()->pluck('region_name')->toArray();
    }

    /**
     * Check if user has access to a specific region
     */
    public function hasAccessToRegion($regionName)
    {
        if ($this->role === 'Super Admin') {
            return true; // Super Admin has access to all regions
        }
        
        if ($this->role === 'Regional Admin') {
            return $this->assignedRegions()->where('region_name', $regionName)->exists();
        }
        
        return false;
    }
}
