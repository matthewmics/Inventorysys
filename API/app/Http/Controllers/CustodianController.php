<?php

namespace App\Http\Controllers;

use App\Models\CustodianBuilding;
use App\Models\Inventory;
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

        return Inventory::with('room')->whereIn(
            'room_id',
            Room::select('id')->whereIn('building_id', CustodianBuilding::select('building_id')->where('user_id', $id))
        )
            ->orWhereNull('room_id')
            ->orderBy('room_id', 'ASC')
            ->paginate(10);
    }
}
