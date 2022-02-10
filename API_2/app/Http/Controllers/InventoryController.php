<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\InventoryParentItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function getItemParents()
    {
        $parentItems = InventoryParentItem::with(['inventory_items:inventory_parent_item_id,id'])
            ->orderBy('created_at')->get();

        return $parentItems;
    }


    public function createItemParent(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'item_type' => 'string|required'
        ]);

        return InventoryParentItem::create($request->all());
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





    public function getItems($id)
    {
        return InventoryItem::orderBy('created_at')
            ->where('inventory_parent_item_id', $id)
            ->get();
    }

    public function createItem(Request $request)
    {
        $request->validate([
            'serial_number' => 'required|unique:inventory_items,serial_number',
            'brand' => 'required',
            'inventory_parent_item_id' => 'required'
        ]);

        return InventoryItem::create($request->all());
    }
}
