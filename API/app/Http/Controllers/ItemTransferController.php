<?php

namespace App\Http\Controllers;

use App\Models\ItemTransfer;
use Illuminate\Http\Request;

class ItemTransferController extends Controller
{
    public function create(Request $request)
    {
        $id = auth()->user()->id;
        return ItemTransfer::create([
            'room_id' => $request->room_id,
            'user_id' => $id,
            'inventory_id' => $request->inventory_id,
            'status' => 'Pending',
            'item_type' => $request->item_type
        ]);
    }
}
