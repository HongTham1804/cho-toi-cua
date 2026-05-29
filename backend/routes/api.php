<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;

// Route cho Danh mục
Route::apiResource('categories', CategoryController::class);

// Route cho Sản phẩm
Route::apiResource('products', ProductController::class);