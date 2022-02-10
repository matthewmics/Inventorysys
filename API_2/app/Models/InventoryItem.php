<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\InventoryParentItem;

class InventoryItem extends Model
{
    use HasFactory;
    use SoftDeletes;

    public $fillable = [
        'brand',
        'serial_number',
        'inventory_parent_item_id'
    ];

    public function inventory_parent_item(){
        return $this->belongsTo(InventoryParentItem::class);
    }
}
