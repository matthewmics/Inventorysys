<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Room;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'item_type', 'status', 'room_Id', 'serial_number'];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
