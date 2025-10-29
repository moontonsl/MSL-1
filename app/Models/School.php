<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Municipality;
use App\Models\Region;
use App\Models\Province;

class School extends Model
{
    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }
    public function region()
    {
        return $this->belongsTo(Region::class);
    }
    
    public function province()
    {
        return $this->hasOneThrough(Province::class, Municipality::class, 'id', 'id', 'municipality_id', 'province_id');
    }
}
