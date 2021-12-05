<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Room;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'item_type', 'qty'];

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'inventory_room', 'inventory_id', 'room_id');
    }
}
