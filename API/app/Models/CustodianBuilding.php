<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustodianBuilding extends Model
{
    protected $table = 'custodian_building';
    public $timestamps = false;
    

    use HasFactory;

    protected $fillable = ['user_id', 'building_id'];
}
