<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoryItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('inventory_parent_item_id');
            $table->string('brand', 100);
            $table->string('serial_number', 255);


            $table->timestamps();
            $table->softDeletes();

            $table->foreign('inventory_parent_item_id')->references('id')->on('inventory_parent_items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventory_items');
    }
}
