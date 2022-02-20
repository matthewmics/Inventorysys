<?php

namespace App\Http\Controllers;

use App\Models\FileStorage;
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
            'details' => 'required',
            'file' => 'required'
        ]);

        $base64file = base64_encode(file_get_contents($request->file('file')->path()));

        $file_storage = FileStorage::create([
            'name' => uniqid() . "_" . $request->file('file')->getClientOriginalName(),
            'base64' => $base64file
        ]);

        $item = InventoryItem::find($request->item_id);

        $request['requestor_user_id'] = $userId;
        $request['current_room_id'] = $item->room_id;
        $request['file_storage_id'] = $file_storage->id;

        return TransferRequest::create($request->all());
    }
}
