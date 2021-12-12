<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class CustodianController extends Controller
{
    public function custodianBuildings($id){
        return User::find($id)->buildings;
    }
}
