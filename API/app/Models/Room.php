<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Building;
use App\Models\Inventory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['building_id', 'name', 'room_type'];

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }
}
