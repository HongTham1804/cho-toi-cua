<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'order_id',
        'type',
        'amount',
        'balance_after',
        'description',
        'metadata',
    ];

    protected $casts = [
        'wallet_id' => 'integer',
        'order_id' => 'integer',
        'amount' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'array',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
