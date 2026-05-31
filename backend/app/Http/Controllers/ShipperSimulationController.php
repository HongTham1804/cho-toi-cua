<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignShipperRequest;
use App\Models\Order;
use App\Models\Shipper;
use Illuminate\Http\JsonResponse;

class ShipperSimulationController extends Controller
{
    public function index(): JsonResponse
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

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        $shipper = $request->filled('shipper_id')
            ? Shipper::find($request->shipper_id)
            : Shipper::inRandomOrder()->first();

        if (!$shipper) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa có shipper nào trong hệ thống.',
            ], 400);
        }

        $order->update([
            'shipper_id' => $shipper->id,
            'status' => 'shipping',
        ]);

        $order->refresh()->load(['customer', 'store', 'shipper', 'details.product']);

        return response()->json([
            'success' => true,
            'message' => 'Đã gán shipper và chuyển đơn hàng sang trạng thái đang giao.',
            'data' => [
                'order' => $order,
                'shipper' => $shipper,
            ],
        ]);
    }
}
