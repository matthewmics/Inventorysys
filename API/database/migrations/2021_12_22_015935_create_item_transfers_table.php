<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemTransfersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('item_type', 50);
            
            $table->bigInteger('inventory_id');
            $table->bigInteger('room_id');

            $table->string('status', 50);

            $table->timestamps();

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
        Schema::dropIfExists('item_transfers');
    }
}
