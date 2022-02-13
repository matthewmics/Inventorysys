<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\TransferRequest;
use Illuminate\Http\Request;

class TransferRequestController extends Controller
{

    public function getRequests()
    {
        return TransferRequest::with(['item', 'current_room', 'destination_room', 'requestor', 'item.inventory_parent_item'])
            ->orderBy('id')->get();
    }

    public function requestTransfer(Request $request)
    {
        $userId = auth()->user()->id;

        $request->validate([
            'destination_room_id' => 'required',
            'item_id' => 'required',
            'details' => 'required'
        ]);

        $item = InventoryItem::find($request->item_id);

        $request['requestor_user_id'] = $userId;
        $request['current_room_id'] = $item->room_id;

        return TransferRequest::create($request->all());
    }
}
