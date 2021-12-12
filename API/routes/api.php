<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustodianController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\RoomController;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

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
    
    Route::post('/buildings/custodian-allocate', [BuildingController::class, 'custodianAllocate']);
    Route::get('/buildings/{id}/rooms', [BuildingController::class, 'rooms']);
    Route::resource('buildings', BuildingController::class);
    Route::get('/buildings/search/{name}', [BuildingController::class, 'search']);

    Route::post('/rooms/{id}/unallocate', [RoomController::class, 'unallocate']);
    Route::post('/rooms/{id}/allocate', [RoomController::class, 'allocate']);
    Route::get('/rooms/unallocated', [RoomController::class, 'listUnallocated']);
    Route::resource('rooms', RoomController::class);

    Route::post('/inventories/{inventoryId}/allocate-room', [InventoryController::class, 'allocateRoom']);
    Route::resource('inventories', InventoryController::class);

    Route::get('/accounts', [AccountController::class, 'index']);
    Route::post('/accounts', [AccountController::class, 'create']);

    Route::get('/custodians/{id}/buildings', [CustodianController::class, 'custodianBuildings']);
});


Route::get('/reseed', function () {

    DB::table('users')->delete();
    DB::table('inventories')->delete();
    DB::table('rooms')->delete();
    DB::table('buildings')->delete();

    DB::table('users')->insert([
        [
            'id' => 1,
            'name' => 'Admin',
            'email' => 'admin@inventory.com',
            'password' => bcrypt('admin'),
            'role' => 'Admin',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ],
        [
            'id' => 2,
            'name' => 'Stella Grant',
            'email' => 'custodian1@inventory.com',
            'password' => bcrypt('password'),
            'role' => 'Custodian',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]
    ]);
    DB::table('inventories')->insert([
        [
            'id' => 1,
            'name' => 'Desktop1',
            'item_type' => 'PC',
            'serial_number' => 'a1be3123a',
            'status' => 'Stock',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]
    ]);

    DB::table('rooms')->insert([
        [
            'id' => 1,
            'name' => 'Room 101',
            'room_type' => 'Room',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ],
        [
            'id' => 2,
            'name' => 'Room 102',
            'room_type' => 'Room',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ],
        [
            'id' => 3,
            'name' => 'Lab 201',
            'item_type' => 'Lab',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ],
        [
            'id' => 4,
            'name' => 'Lab 202',
            'item_type' => 'Lab',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]
    ]);

    DB::table('buildings')->insert([
        [
            'id' => 1,
            'name' => 'Building 1',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ],
        [
            'id' => 2,
            'name' => 'Building 2',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ],
        [
            'id' => 3,
            'name' => 'Building 3',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]
    ]);

    return "Database has been reseeded";
});
