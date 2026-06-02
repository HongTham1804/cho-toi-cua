<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartnerOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user || $user->role !== 'partner') {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập đơn hàng của siêu thị.',
            ], 403);
        }

        $stores = $user->stores()->select('id', 'name', 'address', 'status')->get();
        $storeIds = $stores->pluck('id');

        if ($stores->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy siêu thị thuộc tài khoản đối tác này.',
            ], 404);
        }

        $query = Order::with(['customer', 'store', 'shipper', 'details.product'])
            ->whereIn('store_id', $storeIds);

        if ($request->filled('store_id')) {
            $requestedStoreId = (int) $request->query('store_id');

            if (! $storeIds->contains($requestedStoreId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền xem đơn hàng của siêu thị này.',
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
                'message' => 'Chỉ có thể chuẩn bị đơn đang chờ xử lý.',
            ], 422);
        }

        $order->update([
            'status' => 'preparing',
        ]);

        $order->refresh()->load(['customer', 'store', 'shipper', 'details.product']);

        return response()->json([
            'success' => true,
            'message' => 'Siêu thị đang chuẩn bị hàng cho đơn này.',
            'data' => [
                'order' => $order,
                'shipper' => $order->shipper,
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
                'message' => 'Chỉ có thể chuyển đơn đang chờ bàn giao sang đang giao.',
            ], 422);
        }

        if (! $order->shipper_id) {
            $shipper = Shipper::inRandomOrder()->first();

            if (! $shipper) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chưa có shipper nào trong hệ thống.',
                ], 400);
            }

            $order->shipper_id = $shipper->id;
        }

        $order->update([
            'status' => 'shipping',
        ]);

        $order->refresh()->load(['customer', 'store', 'shipper', 'details.product']);

        return response()->json([
            'success' => true,
            'message' => 'Shipper đã nhận đơn và bắt đầu giao hàng.',
            'data' => [
                'order' => $order,
                'shipper' => $order->shipper,
            ],
        ]);
    }

    private function denyIfOrderIsNotOwnedByPartner(Request $request, Order $order): ?JsonResponse
    {
        $user = $request->user();

        if (! $user || $user->role !== 'partner') {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xử lý đơn hàng của siêu thị.',
            ], 403);
        }

        $storeIds = $user->stores()->pluck('id');

        if (! $storeIds->contains((int) $order->store_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xử lý đơn hàng của siêu thị này.',
            ], 403);
        }

        return null;
    }
}
