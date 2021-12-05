<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryRoom extends Model
{
    use HasFactory;

    protected $table = 'inventory_room';

    protected $fillable = ['room_id', 'inventory_id', 'qty'];
}
