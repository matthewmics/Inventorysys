<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Room;

class Building extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function custodians()
    {
        return $this->belongsToMany(User::class, 'custodian_building', 'user_id', 'building_id');
    }
}
