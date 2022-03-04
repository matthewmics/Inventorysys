<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\InventoryParentItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function getItemParents()
    {
        $parentItems = InventoryParentItem::with(['inventory_items' => function ($query) {
            $query->select('inventory_parent_item_id', 'id')->where('is_disposed', false);
        }])
            ->orderBy('id')->get();

        return $parentItems;
    }

    public function getAvailableItemParents()
    {
        $parentItems = InventoryParentItem::with(['inventory_items' => function ($query) {
            $query->select('inventory_parent_item_id', 'id')->whereNull('room_id');
        }])
            ->orderBy('id')->get();

        return $parentItems;
    }

    public function getAvailableItems($inventory_parent_item_id)
    {
        return InventoryItem::with(['room', 'transfer_requests' => function ($query) {
            $query->whereNotIn('status', ['completed', 'rejected']);
        }, 'repair_requests' => function ($query) {
            $query->whereNotIn('status', ['completed', 'rejected', 'disposed', 'replaced', 'PO created']);
        }])
            ->orderBy('created_at')
            ->where('inventory_parent_item_id', $inventory_parent_item_id)
            ->whereNull('room_id')
            ->orderBy('id')
            ->get();
    }

    public function createItemParent(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'item_type' => 'string|required'
        ]);

        return InventoryParentItem::create($request->all());
    }

    public function findItemParent($id)
    {
        return InventoryParentItem::find($id);
    }

    public function updateItemParent(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'item_type' => 'string|required'
        ]);

        $item = InventoryParentItem::find($id);

        $item->update($request->all());

        return $item;
    }

    public function deleteItemParent($id)
    {

        $item = InventoryParentItem::find($id);

        $item->delete();

        return response()->noContent();
    }


    //--

    public function findItem($id)
    {
        return InventoryItem::find($id);
    }


    public function getItems($id)
    {
        return InventoryItem::with('room')->orderBy('created_at')
            ->where('inventory_parent_item_id', $id)
            ->where('is_disposed', false)
            ->orderBy('id')
            ->get();
    }

    public function createItem(Request $request)
    {
        $request->validate([
            'serial_number' => 'required',
            'brand' => 'required',
            'inventory_parent_item_id' => 'required'
        ]);

        return InventoryItem::create($request->all());
    }

    public function updateItem(Request $request, $id)
    {

        $request->validate([
            'serial_number' => 'required',
            'brand' => 'required'
        ]);

        $item = InventoryItem::find($id);
        $item->update($request->all());

        return $item;
    }


    public function deleteItem($id)
    {

        $item = InventoryItem::find($id);
        $item->delete();
        return response()->noContent();
    }

    public function disposeItem($id)
    {

        $item = InventoryItem::find($id);
        $item->update([
            'is_disposed' => true,
            'deleted_at' => Carbon::now('UTC'),
            'room_id' => null
        ]);

        return response()->noContent();
    }
}
