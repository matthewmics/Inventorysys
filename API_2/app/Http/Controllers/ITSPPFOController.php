<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Notification;
use App\Models\TransferRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ITSPPFOController extends Controller
{
    public function listTransferRequests(Request $request)
    {
        $role = auth()->user()->role;

        if ($role === 'ppfo') {

            return TransferRequest::with(['item', 'current_room', 'destination_room', 'requestor', 'item.inventory_parent_item'])
                ->whereNotIn('item_type', ['PC'])
                ->whereNotIn('status', ['completed', 'rejected', 'disposed'])
                ->orderBy('id')
                ->get();
        } else if ($role === 'its') {

            return TransferRequest::with(['item', 'current_room', 'destination_room', 'requestor', 'item.inventory_parent_item'])
                ->where('item_type', 'PC')
                ->whereNotIn('status', ['completed', 'rejected', 'disposed'])
                ->orderBy('id')
                ->get();
        }

        return TransferRequest::with(['item', 'current_room', 'destination_room', 'requestor', 'item.inventory_parent_item'])
            ->whereNotIn('status', ['completed', 'rejected', 'disposed'])
            ->orderBy('id')
            ->get();
    }

    public function rejectRequest(Request $request)
    {
        $handler_id = auth()->user()->id;

        $request->validate([
            "rejection_details" => "required"
        ]);

        $request_id = $request['transfer_request_id'];

        $request = TransferRequest::with(['item', 'item.inventory_parent_item'])->find($request_id);

        $request->status = 'rejected';
        $request->handler_user_id = $handler_id;
        $request->rejection_details = $request['rejection_details'];

        $request->save();

        Notification::create([
            'user_id' => $request->requestor_user_id,
            'message' => "Your request to transfer a <b>" . $request->item->inventory_parent_item->name . "</b> has been rejected"
        ]);

        return $request;
    }


    public function workOnRequest(Request $request)
    {
        $handler_id = auth()->user()->id;

        $request_id = $request['transfer_request_id'];

        $request = TransferRequest::with(['item', 'item.inventory_parent_item'])->find($request_id);

        $request->status = 'in progress';
        $request->handler_user_id = $handler_id;

        $request->save();


        Notification::create([
            'user_id' => $request->requestor_user_id,
            'message' => "Your request to transfer a <b>" . $request->item->inventory_parent_item->name . "</b> is now in progress"
        ]);

        return $request;
    }


    public function finishRequest(Request $request)
    {
        $handler_id = auth()->user()->id;

        $request_id = $request['transfer_request_id'];

        $request = TransferRequest::with(['item', 'item.inventory_parent_item'])->find($request_id);

        $item = InventoryItem::find($request->item_id);

        $item->room_id = $request->destination_room_id;

        $item->save();

        $request->status = 'completed';
        $request->handler_user_id = $handler_id;

        $request->save();

        Notification::create([
            'user_id' => $request->requestor_user_id,
            'message' => "Your request to transfer a <b>" . $request->item->inventory_parent_item->name . "</b> is now completed"
        ]);

        return $request;
    }
}
