<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Nhớ import cái này
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use SoftDeletes; // Kích hoạt xóa mềm

    protected $fillable = [
        'name', 
        'price',            // <--- Bổ sung dòng này nếu đang thiếu
        'original_price', 
        'stock', 
        'store_id', 
        'category_id', 
        'status', 
        'image'
    ];

    // Mối quan hệ N-1: Sản phẩm thuộc về một danh mục [cite: 122]
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Mối quan hệ N-1: Sản phẩm thuộc về một siêu thị [cite: 124]
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
    public function scopeFilter($query, array $filters)
{
    $query->when($filters['keyword'] ?? null, function ($q, $keyword) {
        $q->where('name', 'like', '%' . $keyword . '%');
    })->when($filters['category_id'] ?? null, function ($q, $category_id) {
        $q->where('category_id', $category_id);
    })->when($filters['min_price'] ?? null, function ($q, $min) {
        $q->where('price', '>=', $min);
    })->when($filters['max_price'] ?? null, function ($q, $max) {
        $q->where('price', '<=', $max);
    });
}

public function scopeSort($query, $sort)
{
    return match($sort) {
        'price_asc' => $query->orderBy('price', 'asc'),
        'price_desc' => $query->orderBy('price', 'desc'),
        'newest' => $query->orderBy('created_at', 'desc'),
        default => $query->orderBy('created_at', 'desc'),
    };
}
}