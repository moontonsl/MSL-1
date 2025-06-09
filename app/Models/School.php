<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Municipality;
use App\Models\Region;

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
}
