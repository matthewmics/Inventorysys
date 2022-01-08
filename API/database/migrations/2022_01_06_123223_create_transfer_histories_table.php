<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransferHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transfer_histories', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('user_acceptor_id');

            $table->bigInteger('user_custodian_id');

            $table->bigInteger('room_from_id');

            $table->bigInteger('room_to_id');

            $table->bigInteger('item_transfer_id');

            $table->string('transfer_item_type', 50);

            $table->string('transfer_result', 50);

            $table->timestamps();

            
            $table->foreign('user_acceptor_id')->references('id')->on('users');
            $table->foreign('user_custodian_id')->references('id')->on('users');
            
            $table->foreign('room_from_id')->references('id')->on('rooms');
            $table->foreign('room_to_id')->references('id')->on('rooms');
            
            $table->foreign('item_transfer_id')->references('id')->on('item_transfers');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transfer_histories');
    }
}
