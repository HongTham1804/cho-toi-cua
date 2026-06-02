<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class PayosService
{
    public function getPaymentLinkInfo(Order $order): array
    {
        $paymentId = $order->payment_reference ?: $order->id;
        $response = Http::timeout(20)
            ->acceptJson()
            ->withHeaders([
                'x-client-id' => (string) config('services.payos.client_id'),
                'x-api-key' => (string) config('services.payos.api_key'),
            ])
            ->get(rtrim((string) config('services.payos.endpoint'), '/') . "/v2/payment-requests/{$paymentId}");

        $payload = $response->json();

        if (! $response->ok() || ($payload['code'] ?? null) !== '00') {
            throw new \RuntimeException($payload['desc'] ?? $payload['message'] ?? 'Không thể lấy trạng thái thanh toán PayOS.');
        }

        return $payload['data'] ?? [];
    }

    public function isPaymentPaid(Order $order, array $paymentInfo): bool
    {
        $orderAmount = (int) round((float) $order->total_amount);
        $amountPaid = (int) round((float) ($paymentInfo['amountPaid'] ?? 0));
        $status = strtoupper((string) ($paymentInfo['status'] ?? ''));

        return $status === 'PAID' || $amountPaid >= $orderAmount;
    }

    public function createPaymentLink(Order $order): array
    {
        $order->loadMissing(['details.product']);

        $amount = (int) round((float) $order->total_amount);
        $frontendUrl = rtrim((string) config('services.payos.frontend_url'), '/');
        $returnUrl = "{$frontendUrl}/order-detail/{$order->id}?payment=payos_success";
        $cancelUrl = "{$frontendUrl}/order-detail/{$order->id}?payment=payos_cancel";

        $body = [
            'orderCode' => (int) $order->id,
            'amount' => $amount,
            'description' => 'DH' . str_pad((string) $order->id, 6, '0', STR_PAD_LEFT),
            'returnUrl' => $returnUrl,
            'cancelUrl' => $cancelUrl,
            'items' => $order->details->map(fn ($detail) => [
                'name' => mb_substr($detail->product?->name ?? 'San pham', 0, 80),
                'quantity' => (int) $detail->quantity,
                'price' => (int) round((float) $detail->unit_price),
            ])->values()->all(),
        ];
        $body['signature'] = $this->makeSignature(Arr::only($body, [
            'amount',
            'cancelUrl',
            'description',
            'orderCode',
            'returnUrl',
        ]));

        $response = Http::timeout(20)
            ->acceptJson()
            ->withHeaders([
                'x-client-id' => (string) config('services.payos.client_id'),
                'x-api-key' => (string) config('services.payos.api_key'),
            ])
            ->post(rtrim((string) config('services.payos.endpoint'), '/') . '/v2/payment-requests', $body);

        $payload = $response->json();

        if (! $response->ok() || ($payload['code'] ?? null) !== '00') {
            throw new \RuntimeException($payload['desc'] ?? $payload['message'] ?? 'Không thể tạo thanh toán PayOS.');
        }

        $paymentData = $payload['data'] ?? [];
        $order->update([
            'payment_reference' => $paymentData['paymentLinkId'] ?? (string) $order->id,
        ]);

        return [
            'paymentLinkId' => $paymentData['paymentLinkId'] ?? null,
            'checkoutUrl' => $paymentData['checkoutUrl'] ?? null,
            'qrCode' => $paymentData['qrCode'] ?? null,
            'orderCode' => $paymentData['orderCode'] ?? $order->id,
            'amount' => $paymentData['amount'] ?? $amount,
        ];
    }

    public function verifyWebhook(array $payload): bool
    {
        $data = $payload['data'] ?? null;
        $signature = $payload['signature'] ?? null;

        if (! is_array($data) || ! is_string($signature)) {
            return false;
        }

        return hash_equals($this->makeSignature($data), $signature);
    }

    public function makeSignature(array $data): string
    {
        ksort($data);

        $raw = collect($data)
            ->map(fn ($value, $key) => $key . '=' . $this->stringifySignatureValue($value))
            ->implode('&');

        return hash_hmac('sha256', $raw, (string) config('services.payos.checksum_key'));
    }

    private function stringifySignatureValue(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_array($value) || is_object($value)) {
            return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        return (string) $value;
    }
}
