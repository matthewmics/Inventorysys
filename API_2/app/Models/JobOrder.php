<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\RepairRequest;
use App\Models\User;

class JobOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'handler_user_id',
        'repair_request_id',
        'status'
    ];


    public function handler()
    {
        return $this->belongsTo(User::class, 'repair_request_id');
    }

    public function repair_request()
    {
        return $this->belongsTo(RepairRequest::class, 'repair_request_id');
    }
}
