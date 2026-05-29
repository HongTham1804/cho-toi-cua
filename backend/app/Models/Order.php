<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'store_id',
        'shipper_id',
        'voucher_id',
        'shipping_fee',
        'subtotal',
        'total_amount',
        'shipping_address',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'customer_id' => 'integer',
        'store_id' => 'integer',
        'shipper_id' => 'integer',
        'voucher_id' => 'integer',
        'shipping_fee' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }
}
