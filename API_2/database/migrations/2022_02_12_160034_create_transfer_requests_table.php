<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransferRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transfer_requests', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('requestor_user_id');
            $table->bigInteger('current_room_id')->nullable();            
            $table->bigInteger('destination_room_id');    
            $table->bigInteger('item_id');
            $table->text('details');
            $table->string('status', 100)->default('pending');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('requestor_user_id')->references('id')->on('users');
            $table->foreign('current_room_id')->references('id')->on('rooms');
            $table->foreign('destination_room_id')->references('id')->on('rooms');
            $table->foreign('item_id')->references('id')->on('inventory_items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transfer_requests');
    }
}
