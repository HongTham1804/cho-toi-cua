<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlashSaleProduct extends Model {
    protected $fillable = ['flash_sale_id', 'product_id', 'flash_sale_price', 'quantity', 'sold'];

    // Thêm thuộc tính ảo trả về Frontend tính % thanh màu hồng (sold / quantity * 100)
    protected $appends = ['sold_percentage', 'remaining_quantity'];

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }

    public function flashSale(): BelongsTo {
        return $this->belongsTo(FlashSale::class);
    }

    public function getSoldPercentageAttribute(): float {
        if ($this->quantity <= 0) return 0;
        return round(($this->sold / $this->quantity) * 100, 2);
    }

    public function getRemainingQuantityAttribute(): int {
        return max(0, $this->quantity - $this->sold);
    }
}