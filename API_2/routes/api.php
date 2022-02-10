<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\RfidController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use App\Models\InventoryParentItem;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;

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


Route::group(['middleware' => ['auth:sanctum', 'cors']], function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::post('users/{id}/change-password', [UserController::class, 'changePassword']);
    Route::post('users', [UserController::class, 'create']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
    Route::get('/users', [UserController::class, 'list']);
    Route::get('/users/{id}', [UserController::class, 'find']);

    Route::resource('buildings', BuildingController::class);
    Route::resource('rooms', RoomController::class);

    Route::get('/inventory/parents', [InventoryController::class, 'getItemParents']);
    Route::post('/inventory/parents', [InventoryController::class, 'createItemParent']);
    Route::get('/inventory/parents/{id}', [InventoryController::class, 'getItems']);
    Route::put('/inventory/parents/{id}', [InventoryController::class, 'updateItemParent']);
    Route::delete('/inventory/parents/{id}', [InventoryController::class, 'deleteItemParent']);

    Route::post('/inventory/items', [InventoryController::class, 'createItem']);

});
