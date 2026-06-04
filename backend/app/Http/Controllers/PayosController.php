<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\Order;
use App\Services\PayosService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayosController extends Controller
{
    public function create(Request $request, Order $order, PayosService $payos): JsonResponse
    {
        $user = $request->user();

        if ($user?->role !== 'admin' && (int) $order->customer_id !== (int) $user?->id) {
            return response()->json([
                'message' => 'Bạn không có quyền tạo thanh toán cho đơn hàng này.',
            ], 403);
        }

        if ($order->payment_method !== 'payos') {
            return response()->json([
                'message' => 'Đơn hàng này không dùng thanh toán PayOS.',
            ], 422);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Đơn hàng đã được thanh toán.',
                'data' => $order,
            ]);
        }

        return response()->json([
            'message' => 'Tạo thanh toán PayOS thành công.',
            'data' => $payos->createPaymentLink($order),
        ]);
    }

    public function webhook(Request $request, PayosService $payos): JsonResponse
    {
        $payload = $request->all();

        if (! $payos->verifyWebhook($payload)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid PayOS signature.',
            ], 400);
        }

        $data = $payload['data'] ?? [];
        $orderCode = (int) ($data['orderCode'] ?? 0);
        $isPaid = ($data['code'] ?? null) === '00' && (bool) ($data['success'] ?? false);

        if ($orderCode > 0 && $isPaid) {
            DB::transaction(function () use ($data, $orderCode) {
                $order = Order::lockForUpdate()->find($orderCode);

                if (! $order || $order->payment_method !== 'payos' || $order->payment_status === 'paid') {
                    return;
                }

                $paidAmount = (int) round((float) ($data['amount'] ?? 0));
                $orderAmount = (int) round((float) $order->total_amount);

                if ($paidAmount !== $orderAmount) {
                    return;
                }

                $order->update([
                    'payment_status' => 'paid',
                    'payment_reference' => $data['paymentLinkId'] ?? $order->payment_reference,
                    'paid_at' => now(),
                    'status' => 'pending',
                ]);

                AppNotification::updateOrCreate(
                    [
                        'user_id' => $order->customer_id,
                        'order_id' => $order->id,
                        'type' => 'payment',
                    ],
                    [
                        'title' => sprintf('Đơn hàng #%s đã thanh toán', str_pad((string) $order->id, 4, '0', STR_PAD_LEFT)),
                        'message' => 'PayOS đã xác nhận chuyển khoản thành công. Đơn hàng của bạn đã chuyển sang mục chờ xử lý.',
                        'link' => "/order-detail/{$order->id}",
                        'is_read' => false,
                    ]
                );
            });
        }

        return response()->json([
            'success' => true,
        ]);
    }
}
