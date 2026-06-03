use App\Http\Controllers\VoucherController;
use App\Http\Controllers\FlashSaleController;

Route::get('/vouchers/store/{store_id}', [VoucherController::class, 'getStoreVouchers']);
Route::get('/flash-sales/active', [FlashSaleController::class, 'getActiveFlashSale']);

Route::middleware('auth:sanctum')->group(function () {
    // Khách hàng lưu mã giảm giá vào ví
    Route::post('/vouchers/save', [VoucherController::class, 'saveVoucher']);
    

    Route::post('/vouchers', [VoucherController::class, 'store']);
    Route::post('/flash-sales', [FlashSaleController::class, 'store']);
});