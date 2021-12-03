<?php

use App\Http\Controllers\BuildingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::get('/test', function (Request $request) {
    return response('Hello World', 200)
        ->header('Content-Type', 'text/plain');
});



Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/buildings/{id}/rooms', [BuildingController::class, 'rooms']);
    Route::resource('buildings', BuildingController::class);
    Route::get('/buildings/search/{name}', [BuildingController::class, 'search']);

    Route::post('/rooms/{id}/unallocate', [RoomController::class, 'unallocate']);
    Route::post('/rooms/{id}/allocate', [RoomController::class, 'allocate']);
    Route::get('/rooms/unallocated', [RoomController::class, 'listUnallocated']);
    Route::resource('rooms', RoomController::class);
});
