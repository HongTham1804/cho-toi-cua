<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\AppNotification;
use App\Models\Order;
use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = min(max($perPage, 1), 100);

        $orders = Order::with(['customer', 'store', 'shipper', 'shipment', 'details.product'])
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
                    if ((int) $product->store_id !== (int) $data['store_id']) {
                        throw new \Exception("Sản phẩm {$product->name} không thuộc siêu thị đang thanh toán.");
                    }

                    if (! $product->is_active || $product->stock <= 0) {
                        throw new \Exception("Sản phẩm {$product->name} tạm hết hàng, xin lỗi quý khách.");
                    }

                    if ($product->stock < $quantity) {
                        throw new \Exception("Sản phẩm {$product->name} chỉ còn {$product->stock} sản phẩm, xin lỗi quý khách.");
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
                $discountVoucher = isset($data['voucher_id'])
                    ? $this->resolveVoucher((int) $data['voucher_id'], (int) $data['customer_id'], (int) $data['store_id'], $subtotal, ['fixed', 'percentage'])
                    : null;
                $shippingVoucher = isset($data['shipping_voucher_id'])
                    ? $this->resolveVoucher((int) $data['shipping_voucher_id'], (int) $data['customer_id'], (int) $data['store_id'], $subtotal, ['freeship'])
                    : null;

                $orderDiscount = $discountVoucher
                    ? $this->calculateVoucherDiscount($discountVoucher, $subtotal, $shippingFee)
                    : 0;
                $shippingDiscount = $shippingVoucher
                    ? $this->calculateVoucherDiscount($shippingVoucher, $subtotal, $shippingFee)
                    : 0;
                $finalShippingFee = max(0, $shippingFee - $shippingDiscount);
                $totalAmount = max(0, $subtotal + $finalShippingFee - $orderDiscount);

                $order = Order::create([
                    'customer_id' => $data['customer_id'],
                    'store_id' => $data['store_id'],
                    'voucher_id' => $discountVoucher?->id ?? $shippingVoucher?->id,
                    'shipping_fee' => $finalShippingFee,
                    'subtotal' => $subtotal,
                    'total_amount' => $totalAmount,
                    'shipping_address' => $data['shipping_address'],
                    'delivery_address' => $data['delivery_address'] ?? $data['shipping_address'],
                    'delivery_latitude' => $data['delivery_latitude'] ?? null,
                    'delivery_longitude' => $data['delivery_longitude'] ?? null,
                    'payment_method' => $data['payment_method'],
                    'note' => $data['note'] ?? null,
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

                foreach (array_filter([$discountVoucher, $shippingVoucher]) as $voucher) {
                    $voucher->increment('used_count');
                    $voucher->users()->updateExistingPivot($data['customer_id'], [
                        'is_used' => true,
                    ]);
                }
                Cache::flush();

                return $order->load(['customer', 'store', 'shipper', 'shipment', 'details.product']);
            });

            return response()->json([
                'message' => 'Tạo đơn hàng thành công.',
                'data' => $order,
            ], 201);
        } catch (\Throwable $e) {
            $message = $e->getMessage();

            return response()->json([
                'message' => str_contains($message, 'tạm hết hàng') || str_contains($message, 'chỉ còn')
                    ? $message
                    : 'Không thể tạo đơn hàng: ' . $message,
            ], 400);
        }
    }

    private function resolveVoucher(int $voucherId, int $customerId, int $storeId, float $subtotal, array $allowedTypes): Voucher
    {
        $voucher = Voucher::where('store_id', $storeId)->findOrFail($voucherId);

        if (! in_array($voucher->discount_type, $allowedTypes, true)) {
            throw new \Exception("Voucher {$voucher->code} không đúng loại áp dụng.");
        }

        if (! $voucher->isActive()) {
            throw new \Exception("Voucher {$voucher->code} đã hết hạn hoặc hết lượt.");
        }

        if ($subtotal < (float) $voucher->min_order_value) {
            throw new \Exception("Đơn hàng chưa đủ điều kiện dùng voucher {$voucher->code}.");
        }

        $savedVoucher = $voucher->users()
            ->where('users.id', $customerId)
            ->wherePivot('is_used', false)
            ->exists();

        if (! $savedVoucher) {
            throw new \Exception("Bạn chưa lưu hoặc đã dùng voucher {$voucher->code}.");
        }

        return $voucher;
    }

    private function calculateVoucherDiscount(Voucher $voucher, float $subtotal, float $shippingFee): float
    {
        if ($voucher->discount_type === 'freeship') {
            return min($shippingFee, (float) $voucher->discount_amount);
        }

        if ($voucher->discount_type === 'percentage') {
            $discount = $subtotal * ((float) $voucher->discount_amount / 100);

            return min($discount, (float) ($voucher->max_discount_amount ?? $discount));
        }

        return min($subtotal, (float) $voucher->discount_amount);
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with(['customer', 'store', 'shipper', 'shipment', 'details.product'])->find($id);

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

            return $order->fresh()->load(['customer', 'store', 'shipper', 'shipment', 'details.product']);
        });

        return response()->json([
            'message' => 'Hủy đơn hàng thành công.',
            'data' => $order,
        ]);
    }

    public function arrived(int $id): JsonResponse
    {
        $order = Order::with(['customer', 'store', 'shipper', 'shipment', 'details.product'])->find($id);

        if (! $order) {
            return response()->json([
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if ($order->status !== 'shipping') {
            return response()->json([
                'message' => 'Chỉ có thể đánh dấu đã đến nơi cho đơn đang giao.',
            ], 422);
        }

        $order = DB::transaction(function () use ($order) {
            if ($order->shipment) {
                $order->shipment->update([
                    'status' => 'arrived',
                    'progress' => 100,
                    'current_latitude' => $order->shipment->destination_latitude,
                    'current_longitude' => $order->shipment->destination_longitude,
                    'arrived_at' => $order->shipment->arrived_at ?? now(),
                ]);
            }

            AppNotification::updateOrCreate(
                [
                    'user_id' => $order->customer_id,
                    'order_id' => $order->id,
                    'type' => 'delivery',
                ],
                [
                    'title' => sprintf('Đơn hàng #%s đã đến nơi', str_pad((string) $order->id, 4, '0', STR_PAD_LEFT)),
                    'message' => 'Đơn hàng của bạn đã đến địa chỉ nhận hàng. Vui lòng kiểm tra và xác nhận đã nhận được hàng.',
                    'link' => "/order-detail/{$order->id}",
                    'is_read' => false,
                ]
            );

            return $order->fresh()->load(['customer', 'store', 'shipper', 'shipment', 'details.product']);
        });

        return response()->json([
            'message' => 'Đơn hàng đã đến nơi.',
            'data' => $order,
        ]);
    }

    public function complete(int $id): JsonResponse
    {
        $order = Order::with(['customer', 'store', 'shipper', 'shipment', 'details.product'])->find($id);

        if (! $order) {
            return response()->json([
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if ($order->status !== 'shipping') {
            return response()->json([
                'message' => 'Chỉ có thể xác nhận đã nhận hàng cho đơn đang giao.',
            ], 422);
        }

        $order = DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'completed',
            ]);

            if ($order->shipment) {
                $order->shipment->update([
                    'status' => 'completed',
                    'progress' => 100,
                    'current_latitude' => $order->shipment->destination_latitude,
                    'current_longitude' => $order->shipment->destination_longitude,
                    'arrived_at' => $order->shipment->arrived_at ?? now(),
                    'completed_at' => now(),
                ]);
            }

            AppNotification::updateOrCreate(
                [
                    'user_id' => $order->customer_id,
                    'order_id' => $order->id,
                    'type' => 'success',
                ],
                [
                    'title' => sprintf('Đơn hàng #%s đã hoàn thành', str_pad((string) $order->id, 4, '0', STR_PAD_LEFT)),
                    'message' => 'Cảm ơn bạn đã xác nhận đã nhận hàng. Hãy đánh giá sản phẩm nếu bạn có thời gian nhé.',
                    'link' => "/order-detail/{$order->id}",
                    'is_read' => false,
                ]
            );

            return $order->fresh()->load(['customer', 'store', 'shipper', 'shipment', 'details.product']);
        });

        return response()->json([
            'message' => 'Đã xác nhận nhận hàng thành công.',
            'data' => $order,
        ]);
    }
}
