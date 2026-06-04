<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignShipperRequest;
use App\Models\Order;
use App\Models\Shipper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShipperSimulationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $shippers = Shipper::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $shippers,
        ]);
    }

    public function assignShipper(AssignShipperRequest $request, int $id): JsonResponse
    {
        $order = Order::with(['customer', 'store', 'shipper', 'details.product'])->find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        $user = $request->user();

        if ($user?->role === 'partner' && ! $user->stores()->whereKey($order->store_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền gán shipper cho đơn hàng của siêu thị này.',
            ], 403);
        }

        $shipper = $request->filled('shipper_id')
            ? Shipper::find($request->shipper_id)
            : Shipper::inRandomOrder()->first();

        if (! $shipper) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa có shipper nào trong hệ thống.',
            ], 400);
        }

        $order->update([
            'shipper_id' => $shipper->id,
            'status' => 'preparing',
        ]);

        $order->refresh()->load(['customer', 'store', 'shipper', 'details.product']);

        return response()->json([
            'success' => true,
            'message' => 'Đã gán shipper và chuyển đơn hàng sang trạng thái đang lấy hàng.',
            'data' => [
                'order' => $order,
                'shipper' => $shipper,
            ],
        ]);
    }

    public function prepareOrder(int $id): JsonResponse
    {
        $order = Order::with(['customer', 'store', 'shipper', 'details.product'])->find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
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

    public function startDelivery(int $id): JsonResponse
    {
        $order = Order::with(['customer', 'store', 'shipper', 'details.product'])->find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
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
}
