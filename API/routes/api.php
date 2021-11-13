<?php

use App\Http\Controllers\BuildingController;
use App\Models\Building;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/test', function (Request $request) {
    return response('Hello World', 200)
        ->header('Content-Type', 'text/plain');
});

Route::resource('buildings', BuildingController::class);
// Route::get('/buildings', [BuildingController::class, 'index']);
// Route::get('/buildings/{id}', [BuildingController::class, 'show']);
// Route::post('/buildings', [BuildingController::class, 'store']);
