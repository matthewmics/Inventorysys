<?php

namespace App\Http\Controllers;

use App\Models\CustodianBuilding;
use App\Models\Inventory;
use App\Models\ItemTransfer;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;

class CustodianController extends Controller
{
    public function custodianBuildings($id)
    {
        return User::find($id)->buildings;
    }

    public function custodianInventory()
    {
        $id = auth()->user()->id;

        $result = Inventory::with('room')
            ->whereIn(
                'room_id',
                Room::select('id')->whereIn('building_id', CustodianBuilding::select('building_id')->where('user_id', $id))
            )
            ->orWhereNull('room_id')
            ->orderBy('room_id', 'ASC')
            ->paginate(10);

        $result->getCollection()->transform(function ($value) {
            $item_transfer = ItemTransfer::where('status', 'Pending')->where('inventory_id', $value->id)->first();
            $value->transfer_status = $item_transfer ? $item_transfer->status : null;
            return $value;
        });

        return $result;
    }

    public function custodianRooms()
    {
        $id = auth()->user()->id;

        return Room::whereIn('building_id', CustodianBuilding::select('building_id')->where('user_id', $id))->get();
    }
}
