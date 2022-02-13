<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmentBuildingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('department_building', function (Blueprint $table) {
            $table->bigInteger('building_id');
            $table->bigInteger('user_id');
            $table->timestamps();

            $table->foreign('building_id')->references('id')->on('buildings');
            $table->foreign('user_id')->references('id')->on('users');
            $table->primary(['user_id', 'building_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('department_buildings');
    }
}
