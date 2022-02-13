<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\InventoryItem;
use App\Models\Room;
use Illuminate\Http\Request;
use App\Models\InventoryParentItem;

class RoomController extends Controller
{


    public function getItemParents($room_id)
    {
        $parentItems = InventoryParentItem::with(['inventory_items' => function ($query) use ($room_id) {
            $query->select('id', 'inventory_parent_item_id')->where('room_id', $room_id);
        }])
            ->orderBy('id')->get();

        return $parentItems;
    }

    public function getItems($room_id, $inventory_parent_item_id)
    {
        return InventoryItem::with(['room', 'transfer_requests' => function ($query) {
            $query->where('status','pending');
         }])
            ->where('room_id', $room_id)
            ->where('inventory_parent_item_id', $inventory_parent_item_id)
            ->orderBy('id')
            ->get();
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Room::with('building')->orderBy('id')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'room_type' => 'required'
        ]);

        return Room::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Room::with(['building'])->find($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $request->validate([
            'name' => 'required',
            'room_type' => 'required'
        ]);

        $room = Room::find($id);
        $room->update($request->all());
        $room->load('building');
        return $room;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $room = Room::find($id);
        $room->delete();
        return response()->noContent();
    }
}
