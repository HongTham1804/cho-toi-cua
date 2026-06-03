<?php

namespace App\Http/Controllers;

use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FlashSaleController extends Controller {
    // Lấy chiến dịch Flash Sale đang kích hoạt kèm danh sách sản phẩm giá sốc
    public function getActiveFlashSale() {
        $now = Carbon::now();

        $flashSale = FlashSale::where('status', 'active')
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            ->with(['flashSaleProducts.product'])
            ->first();

        if (!$flashSale) {
            return response()->json(['success' => false, 'message' => 'Hiện tại không có chương trình Flash Sale nào.'], 404);
        }

        // Trả dữ liệu ra React hiển thị đếm ngược và thông tin thanh % đã bán
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $flashSale->id,
                'name' => $flashSale->name,
                'end_time' => $flashSale->end_time, // React sẽ lấy trường này trừ đi thời gian hiện tại
                'products' => $flashSale->flashSaleProducts->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'name' => $item->product->name,
                        'image_url' => $item->product->image_url,
                        'original_price' => $item->product->price,
                        'flash_sale_price' => $item->flash_sale_price,
                        'quantity' => $item->quantity,
                        'sold' => $item->sold,
                        'remaining' => $item->remaining_quantity, // Số lượng hàng flash sale còn lại
                        'sold_percentage' => $item->sold_percentage // Dùng cho thanh tiến trình %
                    ];
                })
            ]
        ]);
    }

    // Thiết lập một chiến dịch Giờ vàng mới (Cho Admin/Hệ thống)
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.flash_sale_price' => 'required|numeric|min:0',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $flashSale = FlashSale::create([
            'name' => $validated['name'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'status' => 'upcoming'
        ]);

        foreach ($validated['products'] as $prod) {
            FlashSaleProduct::create([
                'flash_sale_id' => $flashSale->id,
                'product_id' => $prod['product_id'],
                'flash_sale_price' => $prod['flash_sale_price'],
                'quantity' => $prod['quantity'],
                'sold' => 0
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Tạo chiến dịch Flash Sale thành công!'], 201);
    }
}