<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function show(Request $request, Order $order): JsonResponse
    {
        if ($guard = $this->guardOrderAccess($request, $order)) {
            return $guard;
        }

        $order->loadMissing([
            'customer',
            'store',
            'shipper',
            'shipment.shipper',
            'details.product',
        ]);

        $shipment = $order->shipment;
        $shipper = $shipment?->shipper ?? $order->shipper;

        return response()->json([
            'message' => 'Lấy dữ liệu theo dõi đơn hàng thành công.',
            'data' => [
                'order' => [
                    'id' => $order->id,
                    'code' => sprintf('ORD-%04d', $order->id),
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'shipping_address' => $order->shipping_address,
                    'delivery_address' => $order->delivery_address,
                    'delivery_latitude' => $order->delivery_latitude,
                    'delivery_longitude' => $order->delivery_longitude,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                ],
                'store' => $this->storePayload($order),
                'customer' => $this->customerPayload($order),
                'shipper' => $this->shipperPayload($shipper),
                'shipment' => $this->shipmentPayload($shipment),
                'items' => $this->itemsPayload($order),
                'route' => $this->routePayload($order),
                'timeline' => $this->timelinePayload($order),
                'can_track' => $this->canTrack($order),
            ],
        ]);
    }

    private function storePayload(Order $order): ?array
    {
        if (! $order->store) {
            return null;
        }

        return [
            'id' => $order->store->id,
            'name' => $order->store->name,
            'address' => $order->store->address,
            'logo_url' => $order->store->logo_url,
            'latitude' => $order->store->latitude,
            'longitude' => $order->store->longitude,
        ];
    }

    private function customerPayload(Order $order): ?array
    {
        if (! $order->customer) {
            return null;
        }

        return [
            'id' => $order->customer->id,
            'name' => $order->customer->name,
            'phone' => $order->customer->phone,
            'address' => $order->customer->address,
        ];
    }

    private function shipperPayload($shipper): ?array
    {
        if (! $shipper) {
            return null;
        }

        return [
            'id' => $shipper->id,
            'name' => $shipper->name,
            'phone' => $shipper->phone,
            'license_plate' => $shipper->license_plate,
        ];
    }

    private function shipmentPayload($shipment): ?array
    {
        if (! $shipment) {
            return null;
        }

        return [
            'id' => $shipment->id,
            'status' => $shipment->status,
            'progress' => $shipment->progress,
            'current_latitude' => $shipment->current_latitude,
            'current_longitude' => $shipment->current_longitude,
            'origin_latitude' => $shipment->origin_latitude,
            'origin_longitude' => $shipment->origin_longitude,
            'destination_latitude' => $shipment->destination_latitude,
            'destination_longitude' => $shipment->destination_longitude,
            'route_summary' => $shipment->route_summary,
            'started_at' => $shipment->started_at,
            'arrived_at' => $shipment->arrived_at,
            'completed_at' => $shipment->completed_at,
        ];
    }

    private function itemsPayload(Order $order): array
    {
        return $order->details->map(function ($detail) {
            return [
                'id' => $detail->id,
                'product_id' => $detail->product_id,
                'name' => $detail->product?->name,
                'image_url' => $detail->product?->image_url,
                'quantity' => $detail->quantity,
                'unit_price' => $detail->unit_price,
                'total_price' => (float) $detail->unit_price * (int) $detail->quantity,
            ];
        })->values()->all();
    }

    private function routePayload(Order $order): array
    {
        $shipment = $order->shipment;

        $originLat = $shipment?->origin_latitude ?? $order->store?->latitude;
        $originLng = $shipment?->origin_longitude ?? $order->store?->longitude;
        $destinationLat = $shipment?->destination_latitude ?? $order->delivery_latitude;
        $destinationLng = $shipment?->destination_longitude ?? $order->delivery_longitude;
        $currentLat = $shipment?->current_latitude ?? $originLat;
        $currentLng = $shipment?->current_longitude ?? $originLng;

        return [
            'origin' => [
                'lat' => $originLat,
                'lng' => $originLng,
                'label' => $order->store?->name,
                'address' => $order->store?->address,
            ],
            'destination' => [
                'lat' => $destinationLat,
                'lng' => $destinationLng,
                'label' => $order->customer?->name ?? 'Khách hàng',
                'address' => $order->delivery_address ?? $order->shipping_address,
            ],
            'current' => [
                'lat' => $currentLat,
                'lng' => $currentLng,
                'label' => 'Shipper',
            ],
            'has_coordinates' => $this->hasCoordinates($originLat, $originLng, $destinationLat, $destinationLng),
        ];
    }

    private function timelinePayload(Order $order): array
    {
        $shipment = $order->shipment;
        $status = $order->status;

        return [
            [
                'key' => 'pending',
                'title' => 'Đơn hàng đã được tạo',
                'description' => 'Siêu thị đã nhận thông tin đơn hàng.',
                'time' => $order->created_at,
                'done' => true,
                'active' => $status === 'pending',
            ],
            [
                'key' => 'preparing',
                'title' => 'Đang chuẩn bị hàng',
                'description' => 'Siêu thị đang gom sản phẩm trong đơn.',
                'time' => in_array($status, ['preparing', 'shipping', 'completed'], true) ? $order->updated_at : null,
                'done' => in_array($status, ['preparing', 'shipping', 'completed'], true),
                'active' => $status === 'preparing',
            ],
            [
                'key' => 'shipping',
                'title' => 'Shipper đang giao hàng',
                'description' => 'Đơn hàng đang di chuyển từ siêu thị đến vị trí nhận hàng.',
                'time' => $shipment?->started_at,
                'done' => in_array($status, ['shipping', 'completed'], true),
                'active' => $status === 'shipping',
            ],
            [
                'key' => 'completed',
                'title' => 'Hoàn tất đơn hàng',
                'description' => 'Khách hàng đã nhận được hàng.',
                'time' => $shipment?->completed_at,
                'done' => $status === 'completed',
                'active' => $status === 'completed',
            ],
        ];
    }

    private function canTrack(Order $order): bool
    {
        $route = $this->routePayload($order);

        return (bool) $order->shipment && $route['has_coordinates'];
    }

    private function hasCoordinates(...$values): bool
    {
        foreach ($values as $value) {
            if ($value === null || $value === '') {
                return false;
            }
        }

        return true;
    }

    private function guardOrderAccess(Request $request, Order $order): ?JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Vui long dang nhap de theo doi don hang.',
            ], 401);
        }

        if ($user->role === 'admin') {
            return null;
        }

        if ($user->role === 'customer' && (int) $order->customer_id === (int) $user->id) {
            return null;
        }

        if ($user->role === 'partner' && $user->stores()->whereKey($order->store_id)->exists()) {
            return null;
        }

        return response()->json([
            'message' => 'Ban khong co quyen theo doi don hang nay.',
        ], 403);
    }
}
