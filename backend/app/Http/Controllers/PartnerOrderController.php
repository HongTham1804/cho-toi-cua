<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipment;
use App\Models\Shipper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PartnerOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $this->isConfiguredPartner($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen truy cap don hang cua sieu thi.',
            ], 403);
        }

        $stores = $user->stores()
            ->select('id', 'name', 'address', 'status', 'latitude', 'longitude')
            ->get();
        $storeIds = $stores->pluck('id');

        if ($stores->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Khong tim thay sieu thi thuoc tai khoan doi tac nay.',
            ], 404);
        }

        $query = Order::with(['customer', 'store', 'shipper', 'shipment', 'details.product'])
            ->whereIn('store_id', $storeIds);

        if ($request->filled('store_id')) {
            $requestedStoreId = (int) $request->query('store_id');

            if (! $storeIds->contains($requestedStoreId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ban khong co quyen xem don hang cua sieu thi nay.',
                ], 403);
            }

            $query->where('store_id', $requestedStoreId);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $perPage = (int) $request->query('per_page', 50);
        $perPage = min(max($perPage, 1), 100);

        return response()->json([
            'success' => true,
            'stores' => $stores,
            'data' => $query
                ->latest()
                ->paginate($perPage),
        ]);
    }

    public function prepare(Request $request, Order $order): JsonResponse
    {
        $accessDenied = $this->denyIfOrderIsNotOwnedByPartner($request, $order);

        if ($accessDenied) {
            return $accessDenied;
        }

        if (! in_array($order->status, ['pending', 'preparing'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Chi co the chuan bi don dang cho xu ly.',
            ], 422);
        }

        $order->update([
            'status' => 'preparing',
        ]);

        $order->refresh()->load(['customer', 'store', 'shipper', 'shipment', 'details.product']);

        return response()->json([
            'success' => true,
            'message' => 'Sieu thi dang chuan bi hang cho don nay.',
            'data' => [
                'order' => $order,
                'shipper' => $order->shipper,
                'shipment' => $order->shipment,
            ],
        ]);
    }

    public function startDelivery(Request $request, Order $order): JsonResponse
    {
        $accessDenied = $this->denyIfOrderIsNotOwnedByPartner($request, $order);

        if ($accessDenied) {
            return $accessDenied;
        }

        if (! in_array($order->status, ['preparing', 'shipping'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Chi co the chuyen don dang cho ban giao sang dang giao.',
            ], 422);
        }

        $order->loadMissing('store', 'shipper');

        if (! $order->store?->latitude || ! $order->store?->longitude) {
            return response()->json([
                'success' => false,
                'message' => 'Sieu thi chua co toa do de bat dau tracking.',
            ], 422);
        }

        if (! $order->delivery_latitude || ! $order->delivery_longitude) {
            return response()->json([
                'success' => false,
                'message' => 'Don hang chua co vi tri nhan hang. Vui long tao don moi co cap nhat vi tri khach hang.',
            ], 422);
        }

        try {
            $order = DB::transaction(function () use ($order) {
                if (! $order->shipper_id) {
                    $shipper = Shipper::inRandomOrder()->first();

                    if (! $shipper) {
                        throw new \RuntimeException('Chua co shipper nao trong he thong.');
                    }

                    $order->shipper_id = $shipper->id;
                }

                $order->status = 'shipping';
                $order->save();

                $this->createOrUpdateShipment($order->fresh(['store', 'shipper']));

                return $order->fresh(['customer', 'store', 'shipper', 'shipment', 'details.product']);
            });
        } catch (\RuntimeException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Shipper da nhan don va bat dau giao hang.',
            'data' => [
                'order' => $order,
                'shipper' => $order->shipper,
                'shipment' => $order->shipment,
            ],
        ]);
    }

    private function createOrUpdateShipment(Order $order): Shipment
    {
        return Shipment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'store_id' => $order->store_id,
                'shipper_id' => $order->shipper_id,
                'status' => 'shipping',
                'progress' => 0,
                'current_latitude' => $order->store->latitude,
                'current_longitude' => $order->store->longitude,
                'origin_latitude' => $order->store->latitude,
                'origin_longitude' => $order->store->longitude,
                'destination_latitude' => $order->delivery_latitude,
                'destination_longitude' => $order->delivery_longitude,
                'route_summary' => $order->store->name . ' -> ' . ($order->delivery_address ?: $order->shipping_address),
                'started_at' => now(),
                'arrived_at' => null,
                'completed_at' => null,
            ]
        );
    }

    private function denyIfOrderIsNotOwnedByPartner(Request $request, Order $order): ?JsonResponse
    {
        $user = $request->user();

        if (! $this->isConfiguredPartner($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xu ly don hang cua sieu thi.',
            ], 403);
        }

        $storeIds = $user->stores()->pluck('id');

        if (! $storeIds->contains((int) $order->store_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen xu ly don hang cua sieu thi nay.',
            ], 403);
        }

        return null;
    }

    private function isConfiguredPartner($user): bool
    {
        if (! $user || $user->role !== 'partner') {
            return false;
        }

        $emails = array_values(array_filter(array_map(
            fn ($email) => strtolower(trim((string) $email)),
            [
                env('PARTNER_BHX_EMAIL'),
                env('PARTNER_WINMART_EMAIL'),
                env('PARTNER_GO_EMAIL'),
            ]
        )));

        return $emails === [] || in_array(strtolower($user->email), $emails, true);
    }
}
