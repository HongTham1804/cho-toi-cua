<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FavoriteProductController;
use App\Http\Controllers\FlashSaleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PartnerOrderController;
use App\Http\Controllers\PartnerProductController;
use App\Http\Controllers\PayosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShipperSimulationController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register/send-otp', [AuthController::class, 'sendRegisterOtp']);
    Route::post('/register/verify-otp', [AuthController::class, 'verifyRegisterOtp']);
    Route::post('/partner/register/send-otp', [AuthController::class, 'sendPartnerRegisterOtp']);
    Route::post('/partner/register/verify-otp', [AuthController::class, 'verifyPartnerRegisterOtp']);
    Route::post('/partner/login', [AuthController::class, 'partnerLogin']);
    Route::post('/admin/login', [AuthController::class, 'adminLogin']);
    Route::post('/forgot-password/send-otp', [AuthController::class, 'sendForgotPasswordOtp']);
    Route::post('/partner/forgot-password/send-otp', [AuthController::class, 'sendPartnerForgotPasswordOtp']);
    Route::post('/forgot-password/verify-otp', [AuthController::class, 'verifyForgotPasswordOtp']);
    Route::post('/forgot-password/reset', [AuthController::class, 'resetForgotPassword']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->get('/admin/me', [AuthController::class, 'adminMe']);
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
    Route::middleware('auth:sanctum')->patch('/profile', [AuthController::class, 'updateProfile']);
});

Route::middleware(['auth:sanctum', 'role:customer,admin,partner'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'checkout']);
    Route::get('/orders/{order}/tracking', [TrackingController::class, 'show']);
    Route::get('/orders/{order}/review', [ReviewController::class, 'showOrder']);
    Route::post('/orders/{order}/reviews', [ReviewController::class, 'storeOrderReviews']);
    Route::patch('/orders/{id}/arrived', [OrderController::class, 'arrived']);
    Route::patch('/orders/{id}/complete', [OrderController::class, 'complete']);
    Route::post('/orders/{order}/payos-payment', [PayosController::class, 'create']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancel']);
});
Route::post('/payos/webhook', [PayosController::class, 'webhook']);

Route::middleware(['auth:sanctum', 'role:customer,admin,partner'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
});

Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('/wallet', [WalletController::class, 'show']);
    Route::post('/wallet/top-up', [WalletController::class, 'topUp']);
});

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('stores', StoreController::class)->only(['index', 'show']);
Route::get('/product-images/{slug}.svg', [ProductImageController::class, 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('products', ProductController::class)->only(['store', 'update', 'destroy']);
});
Route::middleware(['auth:sanctum', 'role:partner'])->prefix('partner')->group(function () {
    Route::get('/orders', [PartnerOrderController::class, 'index']);
    Route::match(['post', 'patch'], '/orders/{order}/prepare', [PartnerOrderController::class, 'prepare']);
    Route::match(['post', 'patch'], '/orders/{order}/start-delivery', [PartnerOrderController::class, 'startDelivery']);
    Route::get('/products', [PartnerProductController::class, 'index']);
    Route::patch('/products/{product}', [PartnerProductController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin/users')->group(function () {
    Route::get('/', [AdminUserController::class, 'index']);
    Route::get('/{type}/{id}', [AdminUserController::class, 'show']);
    Route::patch('/{type}/{id}/lock', [AdminUserController::class, 'lock']);
    Route::delete('/{type}/{id}', [AdminUserController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->prefix('favorites')->group(function () {
    Route::get('/', [FavoriteProductController::class, 'index']);
    Route::post('/', [FavoriteProductController::class, 'store']);
    Route::delete('/{product}', [FavoriteProductController::class, 'destroy']);
});
Route::get('/vouchers', [VoucherController::class, 'index']);
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::post('/vouchers/{voucher}/save', [VoucherController::class, 'save']);
    Route::delete('/vouchers/{voucher}/save', [VoucherController::class, 'unsave']);
    Route::get('/user-vouchers', [VoucherController::class, 'userVouchers']);
});
Route::get('/flash-sales', [FlashSaleController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:admin,partner'])->group(function () {
    Route::get('/shippers', [ShipperSimulationController::class, 'index']);
    Route::match(['post', 'patch'], '/orders/{id}/assign-shipper', [ShipperSimulationController::class, 'assignShipper']);
});
