<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlashSaleProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'flash_sale_id',
        'product_id',
        'flash_sale_price',
        'quantity',
        'sold',
    ];

    protected $casts = [
        'flash_sale_price' => 'decimal:2',
    ];

    public function flashSale(): BelongsTo
    {
        return $this->belongsTo(FlashSale::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getRemainingAttribute(): int
    {
        return max(0, (int) $this->quantity - (int) $this->sold);
    }

    public function getSoldPercentAttribute(): int
    {
        if ((int) $this->quantity <= 0) {
            return 0;
        }

        return min(100, (int) round(((int) $this->sold / (int) $this->quantity) * 100));
    }
}
