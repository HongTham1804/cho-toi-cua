<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes; // Kích hoạt xóa mềm

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'original_price',
        'price',
        'discount_price',
        'stock',
        'image_url',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Mối quan hệ: Sản phẩm thuộc về 1 Danh mục
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Mối quan hệ: Sản phẩm thuộc về 1 Siêu thị
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
