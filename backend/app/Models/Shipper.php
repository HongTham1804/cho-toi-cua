<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipper extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'license_plate',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}