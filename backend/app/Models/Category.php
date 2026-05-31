<?php

namespace App\Models;

<<<<<<< HEAD
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'image_url'];

    // Mối quan hệ 1-N: Một danh mục chứa nhiều sản phẩm [cite: 121]
    public function products(): HasMany
=======
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'image_url'];

    // Mối quan hệ: Một Danh mục có nhiều Sản phẩm
    public function products()
>>>>>>> 850014e7c93576d4c5831768d2a492695014519a
    {
        return $this->hasMany(Product::class);
    }
}