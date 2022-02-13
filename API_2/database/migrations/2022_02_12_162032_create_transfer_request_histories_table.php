<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransferRequestHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transfer_request_histories', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('transfer_request_id');
            $table->bigInteger('handler_user_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('transfer_request_id')->references('id')->on('transfer_requests');
            $table->foreign('handler_user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transfer_request_histories');
    }
}
