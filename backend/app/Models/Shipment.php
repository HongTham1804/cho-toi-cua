<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $fillable = [
        'order_id',
        'store_id',
        'shipper_id',
        'status',
        'progress',
        'current_latitude',
        'current_longitude',
        'origin_latitude',
        'origin_longitude',
        'destination_latitude',
        'destination_longitude',
        'route_summary',
        'started_at',
        'arrived_at',
        'completed_at',
    ];

    protected $casts = [
        'order_id' => 'integer',
        'store_id' => 'integer',
        'shipper_id' => 'integer',
        'progress' => 'integer',
        'current_latitude' => 'float',
        'current_longitude' => 'float',
        'origin_latitude' => 'float',
        'origin_longitude' => 'float',
        'destination_latitude' => 'float',
        'destination_longitude' => 'float',
        'started_at' => 'datetime',
        'arrived_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function shipper()
    {
        return $this->belongsTo(Shipper::class);
    }
}
