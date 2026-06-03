<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';
    protected $primaryKey = 'ReviewID';

    protected $fillable = [
        'CustomerID',
        'ProductID',
        'RatingValue',
        'Comment',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'CustomerID', 'UserID');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }
}