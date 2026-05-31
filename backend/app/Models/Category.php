<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'image_url'];

    // Mối quan hệ 1-N: Một danh mục chứa nhiều sản phẩm [cite: 121]
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}