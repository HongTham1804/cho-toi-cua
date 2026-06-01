<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'store_id',
        'code',
        'title',
        'description',
        'discount_type',
        'discount_amount',
        'max_discount_amount',
        'usage_limit',
        'used_count',
        'min_order_value',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'min_order_value' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_vouchers')
            ->withPivot('is_used')
            ->withTimestamps();
    }

    public function isActive(): bool
    {
        $now = now();

        return $this->start_date <= $now
            && $this->end_date >= $now
            && ($this->usage_limit === 0 || $this->used_count < $this->usage_limit);
    }
}
