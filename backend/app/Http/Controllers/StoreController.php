<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;

class StoreController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Store::query()
                ->where('status', 'active')
                ->withCount([
                    'reviews as review_count',
                    'orders as completed_orders_count' => fn (Builder $query) => $query->where('status', 'completed'),
                ])
                ->withAvg('reviews as average_rating', 'rating')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $store = Store::query()
            ->where('status', 'active')
            ->withCount([
                'reviews as review_count',
                'orders as completed_orders_count' => fn (Builder $query) => $query->where('status', 'completed'),
            ])
            ->withAvg('reviews as average_rating', 'rating')
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
