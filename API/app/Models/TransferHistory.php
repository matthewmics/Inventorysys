<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Room;
use App\Models\ItemTransfer;

class TransferHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_acceptor_id',
        'user_custodian_id', 'room_from_id',
        'room_to_id', 'item_transfer_id', 'transfer_item_type', 'transfer_result'
    ];

    public function acceptor()
    {
        return $this->belongsTo(User::class, 'user_acceptor_id');
    }

    public function custodian()
    {
        return $this->belongsTo(User::class, 'user_custodian_id');
    }

    public function room_from()
    {
        return $this->belongsTo(Room::class, 'room_from_id');
    }

    public function room_to()
    {
        return $this->belongsTo(Room::class, 'room_to_id');
    }

    public function item_transfer()
    {
        return $this->belongsTo(ItemTransfer::class, 'item_transfer_id');
    }
}
