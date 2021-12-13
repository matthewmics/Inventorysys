<?php


namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\CustodianBuilding;
use Illuminate\Http\Request;

class BuildingController extends Controller
{

    public function rooms($id)
    {
        return Building::find($id)->rooms;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Building::orderBy('id', 'ASC')->paginate(10);
    }

    public function all()
    {
        return Building::orderBy('id', 'ASC')->get();
    }


    public function custodianAllocate(Request $request)
    {
        $request->validate([
            'user_id' => 'required'
        ]);

        $user_id = $request->user_id;
        $building_ids = $request->building_ids;

        $insert_data = [];

        CustodianBuilding::where('user_id', '=', $user_id)->delete();

        foreach ($building_ids as $building_id) {
            array_push($insert_data, ['user_id' => $user_id, 'building_id' => $building_id]);
        }

        if (!empty($insert_data)) {
            CustodianBuilding::insert($insert_data);
        }
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
            'name' => 'required'
        ]);

        return Building::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Building::find($id);
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
        $building = Building::find($id);
        $building->update($request->all());
        return $building;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $building = Building::find($id);
        $building->delete();
        return response()->noContent();
    }


    public function search($name)
    {
        return Building::where('name', 'like', '%' . $name . '%')->get();
    }
}
