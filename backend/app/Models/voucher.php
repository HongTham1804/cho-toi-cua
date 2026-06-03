<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Voucher extends Model {
    use SoftDeletes;

    protected $fillable = [
        'store_id', 'code', 'discount_amount', 'discount_type', 
        'usage_limit', 'used_count', 'min_order_value', 'start_date', 'end_date'
    ];

    public function store(): BelongsTo {
        return $this->belongsTo(Store::class);
    }

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class, 'user_vouchers')
                    ->withPivot('is_used')
                    ->withTimestamps();
    }
}