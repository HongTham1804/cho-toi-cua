<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = min(max($perPage, 1), 100);

        $orders = Order::with('details')
            ->when($request->filled('customer_id'), function ($query) use ($request) {
                $query->where('customer_id', $request->query('customer_id'));
            })
            ->when($request->filled('store_id'), function ($query) use ($request) {
                $query->where('store_id', $request->query('store_id'));
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->query('status'));
            })
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'message' => 'Lấy danh sách đơn hàng thành công.',
            'data' => $orders,
        ]);
    }

    public function checkout(StoreOrderRequest $request): JsonResponse
    {
        $data = $request->validated();

        $order = DB::transaction(function () use ($data) {
            $subtotal = collect($data['items'])->sum(function (array $item) {
                return (float) $item['unit_price'] * (int) $item['quantity'];
            });

            $shippingFee = (float) ($data['shipping_fee'] ?? 0);
            $totalAmount = $subtotal + $shippingFee;

            $order = Order::create([
                'customer_id' => $data['customer_id'],
                'store_id' => $data['store_id'],
                'voucher_id' => $data['voucher_id'] ?? null,
                'shipping_fee' => $shippingFee,
                'subtotal' => $subtotal,
                'total_amount' => $totalAmount,
                'shipping_address' => $data['shipping_address'],
                'payment_method' => $data['payment_method'],
                'status' => 'pending',
            ]);

            foreach ($data['items'] as $item) {
                $unitPrice = (float) $item['unit_price'];

                $order->details()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'original_price' => $item['original_price'] ?? $unitPrice,
                    'is_flash_sale' => $item['is_flash_sale'] ?? false,
                ]);
            }

            return $order->load('details');
        });

        return response()->json([
            'message' => 'Tạo đơn hàng thành công.',
            'data' => $order,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with('details')->find($id);

        if (! $order) {
            return response()->json([
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        return response()->json([
            'message' => 'Lấy chi tiết đơn hàng thành công.',
            'data' => $order,
        ]);
    }
}
