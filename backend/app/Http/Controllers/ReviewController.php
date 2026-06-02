<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function showOrder(Order $order): JsonResponse
    {
        if ($order->status !== 'completed') {
            return response()->json([
                'message' => 'Chỉ có thể đánh giá đơn hàng đã hoàn thành.',
            ], 422);
        }

        $order->load([
            'customer',
            'store',
            'shipment',
            'details.product.category',
            'details.product.store',
        ]);

        $products = $order->details
            ->filter(fn ($detail) => $detail->product !== null)
            ->map(function ($detail) {
                $product = $detail->product;

                return [
                    'detail_id' => $detail->id,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category?->name,
                    'store_name' => $product->store?->name,
                    'image_url' => $product->image_url,
                    'quantity' => (int) $detail->quantity,
                    'unit_price' => (float) $detail->unit_price,
                    'line_total' => (float) $detail->unit_price * (int) $detail->quantity,
                ];
            })
            ->values();

        return response()->json([
            'data' => [
                'order_id' => $order->id,
                'code' => 'CTC-' . str_pad((string) $order->id, 6, '0', STR_PAD_LEFT),
                'status' => 'Đã hoàn thành',
                'received_at' => $order->shipment?->completed_at ?? $order->updated_at,
                'customer_name' => $order->customer?->name ?? 'Khách hàng',
                'address' => $order->delivery_address ?: ($order->shipping_address ?: $order->customer?->address),
                'store_name' => $order->store?->name,
                'products' => $products,
            ],
        ]);
    }

    public function storeOrderReviews(Request $request, Order $order): JsonResponse
    {
        if ($order->status !== 'completed') {
            return response()->json([
                'message' => 'Chỉ có thể đánh giá đơn hàng đã hoàn thành.',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'anonymous' => ['nullable', 'boolean'],
            'reviews' => ['required', 'array', 'min:1'],
            'reviews.*.productId' => ['required', 'integer', 'exists:products,id'],
            'reviews.*.rating' => ['required', 'integer', 'min:1', 'max:5'],
            'reviews.*.comment' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu đánh giá chưa hợp lệ.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $order->load('details');

        $allowedProductIds = $order->details
            ->pluck('product_id')
            ->map(fn ($id) => (int) $id)
            ->all();

        foreach ($validator->validated()['reviews'] as $reviewData) {
            $productId = (int) $reviewData['productId'];

            if (!in_array($productId, $allowedProductIds, true)) {
                return response()->json([
                    'message' => 'Sản phẩm đánh giá không thuộc đơn hàng này.',
                ], 422);
            }

            Review::updateOrCreate(
                [
                    'user_id' => $order->customer_id,
                    'product_id' => $productId,
                ],
                [
                    'rating' => (int) $reviewData['rating'],
                    'comment' => $reviewData['comment'] ?? null,
                    'created_at' => now(),
                ],
            );
        }

        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Đánh giá đã được ghi nhận. Cảm ơn bạn!',
        ]);
    }
}
