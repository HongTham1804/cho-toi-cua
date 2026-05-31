<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShipperSimulationController;

// ======= ROUTE CỦA THỦY (Danh mục & Sản phẩm) =======
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class);

// ======= ROUTE CỦA TRÂM (Đơn hàng) =======
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'checkout']);
Route::get('/orders/{id}', [OrderController::class, 'show']);

// ======= ROUTE CỦA THÙY (Shipper) =======
Route::get('/shippers', [ShipperSimulationController::class, 'index']);
Route::patch('/orders/{id}/assign-shipper', [ShipperSimulationController::class, 'assignShipper']);