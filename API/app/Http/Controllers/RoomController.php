<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Room::orderBy('id', 'ASC')->paginate(10);
    }

    public function getAll()
    {
        return Room::orderBy('id', 'ASC')->get();
    }

    public function allocate(Request $request, $id)
    {
        $room = Room::find($id);

        $room->building_id = $request->building_id;

        return $room->save();
    }

    public function unallocate($id)
    {
        $room = Room::find($id);

        $room->building_id = null;

        return $room->save();
    }

    public function listUnallocated()
    {
        return Room::whereNull('building_id')->orderBy('id', 'ASC')->get();
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
