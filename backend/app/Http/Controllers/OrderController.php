<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = min(max($perPage, 1), 100);

        $orders = Order::with(['customer', 'store', 'shipper', 'details.product'])
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

        try {
            $order = DB::transaction(function () use ($data) {
                $subtotal = 0;
                $itemsForOrder = [];

                foreach ($data['items'] as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    $quantity = (int) $item['quantity'];
                    if ($product->stock < $quantity) {
                        throw new \Exception("Sản phẩm {$product->name} không đủ tồn kho.");
                    }

                    $unitPrice = $product->discount_price ?? $product->price;
                    $lineTotal = $unitPrice * $quantity;
                    $subtotal += $lineTotal;

                    $itemsForOrder[] = [
                        'product' => $product,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'original_price' => $product->original_price ?? $product->price,
                        'is_flash_sale' => $item['is_flash_sale'] ?? false,
                    ];
                }

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

                foreach ($itemsForOrder as $it) {
                    $order->details()->create([
                        'product_id' => $it['product']->id,
                        'quantity' => $it['quantity'],
                        'unit_price' => $it['unit_price'],
                        'original_price' => $it['original_price'],
                        'is_flash_sale' => $it['is_flash_sale'],
                    ]);

                    // decrement stock
                    $it['product']->decrement('stock', $it['quantity']);
                }

                return $order->load(['customer', 'store', 'shipper', 'details.product']);
            });

            return response()->json([
                'message' => 'Tạo đơn hàng thành công.',
                'data' => $order,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Không thể tạo đơn hàng: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with(['customer', 'store', 'shipper', 'details.product'])->find($id);

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

    public function cancel(int $id): JsonResponse
    {
        $order = Order::with(['details.product'])->find($id);

        if (! $order) {
            return response()->json([
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if (! in_array($order->status, ['pending', 'preparing'], true)) {
            return response()->json([
                'message' => 'Chỉ có thể hủy đơn hàng đang chờ xử lý hoặc đang lấy hàng.',
            ], 422);
        }

        $order = DB::transaction(function () use ($order) {
            foreach ($order->details as $detail) {
                if ($detail->product) {
                    $detail->product->increment('stock', $detail->quantity);
                }
            }

            $order->update([
                'status' => 'cancelled',
            ]);

            return $order->fresh()->load(['customer', 'store', 'shipper', 'details.product']);
        });

        return response()->json([
            'message' => 'Hủy đơn hàng thành công.',
            'data' => $order,
        ]);
    }
}
