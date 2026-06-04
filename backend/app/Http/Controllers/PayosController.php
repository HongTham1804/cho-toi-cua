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
    public function create(Order $order, PayosService $payos): JsonResponse
    {
        if ($order->payment_method !== 'payos') {
            return response()->json([
                'message' => 'Don hang nay khong dung thanh toan PayOS.',
            ], 422);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Don hang da duoc thanh toan.',
                'data' => $order,
            ]);
        }

        return response()->json([
            'message' => 'Tao thanh toan PayOS thanh cong.',
            'data' => $payos->createPaymentLink($order),
        ]);
    }

    public function sync(Order $order, PayosService $payos): JsonResponse
    {
        if ($order->payment_method !== 'payos') {
            return response()->json([
                'message' => 'Don hang nay khong dung thanh toan PayOS.',
            ], 422);
        }

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Don hang da duoc thanh toan.',
                'data' => $order->load(['customer', 'store', 'shipper', 'shipment', 'details.product']),
            ]);
        }

        try {
            $paymentInfo = $payos->getPaymentLinkInfo($order);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Chua the dong bo trang thai PayOS: ' . $e->getMessage(),
                'data' => $order->load(['customer', 'store', 'shipper', 'shipment', 'details.product']),
            ], 502);
        }

        if (! $payos->isPaymentPaid($order, $paymentInfo)) {
            return response()->json([
                'message' => 'Thanh toan PayOS chua hoan tat.',
                'data' => $order->load(['customer', 'store', 'shipper', 'shipment', 'details.product']),
            ]);
        }

        $updatedOrder = DB::transaction(function () use ($order, $paymentInfo) {
            return $this->markOrderPaid($order, $paymentInfo, (int) ($paymentInfo['orderCode'] ?? 0));
        });

        return response()->json([
            'message' => 'Dong bo thanh toan PayOS thanh cong.',
            'data' => $updatedOrder->load(['customer', 'store', 'shipper', 'shipment', 'details.product']),
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
                $order = Order::where('payos_order_code', $orderCode)
                    ->orWhere(function ($query) use ($orderCode) {
                        $query->whereNull('payos_order_code')->whereKey($orderCode);
                    })
                    ->lockForUpdate()
                    ->first();

                if (! $order) {
                    return;
                }

                $this->markOrderPaid($order, $data, $orderCode);
            });
        }

        return response()->json([
            'success' => true,
        ]);
    }

    private function markOrderPaid(Order $order, array $paymentData, int $orderCode = 0): Order
    {
        $order = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

        if ($order->payment_method !== 'payos' || $order->payment_status === 'paid') {
            return $order;
        }

        $paidAmount = (int) round((float) ($paymentData['amountPaid'] ?? $paymentData['amount'] ?? 0));
        $orderAmount = (int) round((float) $order->total_amount);

        if ($paidAmount > 0 && $paidAmount < $orderAmount) {
            return $order;
        }

        $order->update([
            'payment_status' => 'paid',
            'payment_reference' => $paymentData['paymentLinkId'] ?? $order->payment_reference,
            'payos_order_code' => $orderCode ?: ($paymentData['orderCode'] ?? $order->payos_order_code),
            'paid_at' => now(),
            'status' => $order->status === 'pending_payment' ? 'pending' : $order->status,
        ]);

        AppNotification::updateOrCreate(
            [
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'payment',
            ],
            [
                'title' => sprintf('Don hang #%s da thanh toan', str_pad((string) $order->id, 4, '0', STR_PAD_LEFT)),
                'message' => 'PayOS da xac nhan chuyen khoan thanh cong. Don hang cua ban da chuyen sang muc cho xu ly.',
                'link' => "/order-detail/{$order->id}",
                'is_read' => false,
            ]
        );

        return $order->fresh();
    }
}
