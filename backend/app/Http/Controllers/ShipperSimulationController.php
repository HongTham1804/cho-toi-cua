<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignShipperRequest;
use App\Models\Order;
use App\Models\Shipper;

class ShipperSimulationController extends Controller
{
    public function index()
    {
        $shippers = Shipper::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $shippers,
        ]);
    }

    public function assignShipper(AssignShipperRequest $request, int $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        if ($request->filled('shipper_id')) {
            $shipper = Shipper::find($request->shipper_id);
        } else {
            $shipper = Shipper::inRandomOrder()->first();
        }

        if (!$shipper) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa có shipper nào trong hệ thống',
            ], 400);
        }

        $order->update([
            'shipper_id' => $shipper->id,
            'status' => 'Đang giao',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã gán shipper và chuyển đơn hàng sang trạng thái Đang giao',
            'data' => [
                'order' => $order->fresh(),
                'shipper' => $shipper,
            ],
        ]);
    }
}