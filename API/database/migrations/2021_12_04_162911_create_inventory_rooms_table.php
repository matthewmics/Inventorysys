<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoryRoomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_room', function (Blueprint $table) {
            $table->bigInteger('inventory_id');
            $table->bigInteger('room_id');
            $table->integer('qty');

            $table->primary(['inventory_id', 'room_id']);
            $table->foreign('inventory_id')->references('id')->on('inventories');
            $table->foreign('room_id')->references('id')->on('rooms');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventory_room');
    }
}
