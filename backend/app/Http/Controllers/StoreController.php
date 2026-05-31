<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Store::query()
                ->where('status', 'active')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $store = Store::query()
            ->where('status', 'active')
            ->find($id);

        if (! $store) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy siêu thị.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }
}
