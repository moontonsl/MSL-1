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
        'verified_date',
        'squad_name_last_changed',
        'year_level_last_changed'
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
            'email_verification_code_expires_at' => 'datetime',
            'squad_name_last_changed' => 'datetime',
            'year_level_last_changed' => 'datetime',
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
     * Get the region names assigned to this user (including original region)
     */
    public function getAssignedRegionNames()
    {
        $assignedRegions = $this->assignedRegions()->pluck('region_name')->toArray();
        
        // Include original region if it exists and user is Regional Admin
        if ($this->role === 'Regional Admin' && $this->region) {
            $originalRegionName = \Illuminate\Support\Facades\DB::table('regions')
                ->where('id', $this->region)
                ->value('name');
            
            if ($originalRegionName && !in_array($originalRegionName, $assignedRegions)) {
                $assignedRegions[] = $originalRegionName;
            }
        }
        
        return $assignedRegions;
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

    /**
     * Get region IDs for assigned region names (for database queries)
     */
    public function getAssignedRegionIds()
    {
        $regionNames = $this->getAssignedRegionNames();
        if (empty($regionNames)) {
            // If no assigned regions, return original region ID if exists
            if ($this->role === 'Regional Admin' && $this->region) {
                return [$this->region];
            }
            return [];
        }
        
        // Convert region names to IDs
        $regionIds = \Illuminate\Support\Facades\DB::table('regions')
            ->whereIn('name', $regionNames)
            ->pluck('id')
            ->toArray();
            
        return $regionIds;
    }
}
