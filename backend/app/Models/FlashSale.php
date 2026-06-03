<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FlashSale extends Model {
    protected $fillable = ['name', 'start_time', 'end_time', 'status'];

    public function flashSaleProducts(): HasMany {
        return $this->hasMany(FlashSaleProduct::class);
    }
}