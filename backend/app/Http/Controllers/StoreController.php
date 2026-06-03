<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    // Hiển thị danh sách siêu thị
    public function index()
    {
        $stores = Store::all();
        return response()->json($stores, 200);
    }

    // Xem thông tin chi tiết từng siêu thị
    public function show($id)
    {
        $store = Store::find($id);
        if (!$store) {
            return response()->json(['message' => 'Không tìm thấy siêu thị'], 404);
        }
        return response()->json($store, 200);
    }

    // Hàm cập nhật profile siêu thị
    public function updateProfile(Request $request, $id)
    {
        $store = Store::find($id);
        if (!$store) {
            return response()->json(['message' => 'Không tìm thấy siêu thị'], 404);
        }

        $validatedData = $request->validate([
            'StoreName' => 'sometimes|string|max:255',
            'Address' => 'sometimes|string|max:255',
            'OperatingHours' => 'sometimes|string|max:255',
        ]);

        $store->update($validatedData);

        return response()->json(['message' => 'Cập nhật siêu thị thành công', 'store' => $store], 200);
    }
}