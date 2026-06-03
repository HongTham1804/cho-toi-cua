<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ReviewController;

// Routes cho Siêu thị (Stores)
Route::prefix('stores')->group(function () {
    Route::get('/', [StoreController::class, 'index']); // Lấy danh sách siêu thị
    Route::get('/{id}', [StoreController::class, 'show']); // Lấy chi tiết 1 siêu thị
    Route::put('/{id}/profile', [StoreController::class, 'updateProfile']); // Cập nhật profile siêu thị
});

// Routes cho Đánh giá (Reviews)
Route::prefix('reviews')->group(function () {
    Route::post('/', [ReviewController::class, 'store']); // Gửi đánh giá mới
    Route::get('/product/{productId}', [ReviewController::class, 'getProductReviews']); // Lấy đánh giá của 1 sản phẩm
});