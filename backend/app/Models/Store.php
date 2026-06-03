<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $table = 'stores';
    protected $primaryKey = 'StoreID';
    
    protected $fillable = [
        'StoreName',
        'Address',
        'OperatingHours',
        'Rating',
    ];

    // Một siêu thị có nhiều sản phẩm
    public function products()
    {
        return $this->hasMany(Product::class, 'StoreID', 'StoreID');
    }
}