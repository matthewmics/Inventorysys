<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryRoom;
use App\Models\ItemTransfer;
use App\Models\TransferHistory;
use Illuminate\Http\Request;

class ItemTransferController extends Controller
{
    public function transfersList()
    {
        $role = auth()->user()->role;

        if ($role === 'PPFO') {
            return ItemTransfer::with('room', 'inventory_item', 'user')
                ->where('status', 'Pending')->where('item_type', 'Fixture')->get();
        }

        return ItemTransfer::with('room', 'inventory_item', 'user', 'inventory_item.room')
            ->where('status', 'Pending')->where(function ($query) {
                $query->where('item_type', 'PC')
                    ->orWhere('item_type', 'Peripheral');
            })->get();
    }

    public function transferHistory()
    {
        return TransferHistory::with(
            'acceptor',
            'custodian',
            'room_from',
            'room_to',
            'item_transfer',
            'item_transfer.inventory_item'
        )->paginate(10);
    }

    public function create(Request $request)
    {
        $id = auth()->user()->id;

        $inventory = Inventory::find($request->inventory_id);
        return ItemTransfer::create([
            'room_id' => $request->room_id,
            'user_id' => $id,
            'inventory_id' => $request->inventory_id,
            'status' => 'Pending',
            'item_type' => $inventory->item_type
        ]);
    }

    public function declineTransfer(Request $request, $id)
    {
        $acceptorID = auth()->user()->id;

        $itemTransfer = ItemTransfer::find($id);
        $itemTransfer->status = 'Declined';
        $itemTransfer->save();

        $inventoryRoom = Inventory::find($itemTransfer->inventory_id);
        $roomFromID = $inventoryRoom->room_id;

        return TransferHistory::create([
            'user_acceptor_id' => $acceptorID,
            'user_custodian_id' => $itemTransfer->user_id,
            'room_from_id' => $roomFromID,
            'room_to_id' => $itemTransfer->room_id,
            'item_transfer_id' => $itemTransfer->id,
            'transfer_type' => $itemTransfer->item_type,
            'transfer_result' => 'Declined'
        ]);
    }

    public function acceptTransfer(Request $request, $id)
    {
        $acceptorID = auth()->user()->id;

        $itemTransfer = ItemTransfer::find($id);
        $itemTransfer->status = 'Accepted';
        $itemTransfer->save();


        $inventoryRoom = Inventory::find($itemTransfer->inventory_id);

        $roomFromID = $inventoryRoom->room_id;

        $inventoryRoom->room_id = $itemTransfer->room_id;
        $inventoryRoom->save();

        return TransferHistory::create([
            'user_acceptor_id' => $acceptorID,
            'user_custodian_id' => $itemTransfer->user_id,
            'room_from_id' => $roomFromID,
            'room_to_id' => $itemTransfer->room_id,
            'item_transfer_id' => $itemTransfer->id,
            'transfer_item_type' => $itemTransfer->item_type,
            'transfer_result' => 'Accepted'
        ]);
    }
}
