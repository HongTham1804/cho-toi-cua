<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShipperSimulationController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register/send-otp', [AuthController::class, 'sendRegisterOtp']);
    Route::post('/register/verify-otp', [AuthController::class, 'verifyRegisterOtp']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class);

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'checkout']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancel']);

Route::get('/shippers', [ShipperSimulationController::class, 'index']);
Route::match(['post', 'patch'], '/orders/{id}/assign-shipper', [ShipperSimulationController::class, 'assignShipper']);
