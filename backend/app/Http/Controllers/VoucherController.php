<?php

namespace App\Http/Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Carbon\Carbon;

class VoucherController extends Controller {
    // 1. Lấy danh sách Voucher của một Store (Hiển thị UI Ưu đãi)
    public function getStoreVouchers($storeId) {
        $vouchers = Voucher::where('store_id', $storeId)
            ->where('start_date', '<=', Carbon::now())
            ->where('end_date', '>=', Carbon::now())
            ->whereColumn('used_count', '<', 'usage_limit')
            ->get();

        return response()->json(['success' => true, 'data' => $vouchers]);
    }

    // 2. Siêu thị tự tạo Voucher mới
    public function store(Request $request) {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'code' => 'required|string|unique:vouchers,code',
            'discount_amount' => 'required|numeric|min:0',
            'discount_type' => 'required|in:fixed,percentage',
            'usage_limit' => 'required|integer|min:1',
            'min_order_value' => 'nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $voucher = Voucher::create($validated);
        return response()->json(['success' => true, 'message' => 'Tạo mã giảm giá thành công!', 'data' => $voucher], 201);
    }

    // 3. Khách hàng bấm nút "Lưu mã" vào ví voucher
    public function saveVoucher(Request $request) {
        $request->validate([
            'voucher_id' => 'required|exists:vouchers,id',
        ]);

        $user = $request->user(); // Lấy user từ token đăng nhập
        $voucher = Voucher::findOrFail($request->voucher_id);

        // Kiểm tra xem đã lưu chưa
        $exists = $user->vouchers()->where('voucher_id', $voucher->id)->exists();
        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Bạn đã lưu mã này rồi!'], 400);
        }

        // Kiểm tra lượt dùng tổng quát của mã
        if ($voucher->used_count >= $voucher->usage_limit) {
            return response()->json(['success' => false, 'message' => 'Mã giảm giá đã hết lượt sử dụng!'], 400);
        }

        $user->vouchers()->attach($voucher->id);
        return response()->json(['success' => true, 'message' => 'Lưu mã giảm giá thành công!']);
    }
}