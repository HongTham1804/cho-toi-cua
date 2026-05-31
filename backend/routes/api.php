<?php

<<<<<<< HEAD
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

// Đăng ký các API quản lý sản phẩm và danh mục
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']); // <--- ĐÃ BỔ SUNG DÒNG NÀY ĐỂ SỬA LỖI POST METHOD
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::patch('/products/{id}/toggle-status', [ProductController::class, 'toggleStatus']);

Route::get('/categories', [CategoryController::class, 'index']);
=======
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;

// Route cho Danh mục
Route::apiResource('categories', CategoryController::class);

// Route cho Sản phẩm
Route::apiResource('products', ProductController::class);
>>>>>>> 850014e7c93576d4c5831768d2a492695014519a
