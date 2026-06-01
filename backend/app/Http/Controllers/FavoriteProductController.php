<?php

namespace App\Http\Controllers;

use App\Models\FavoriteProduct;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FavoriteProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = FavoriteProduct::query()
            ->with(['product.category', 'product.store'])
            ->where('user_id', $request->user()->id)
            ->latest('added_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $favorites,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ], [
            'product_id.required' => 'Thiếu sản phẩm cần thêm vào yêu thích.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',
        ]);

        $product = Product::query()
            ->where('is_active', true)
            ->find($validated['product_id']);

        if (! $product) {
            throw ValidationException::withMessages([
                'product_id' => ['Sản phẩm không còn được bán.'],
            ]);
        }

        $favorite = FavoriteProduct::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $product->id,
            ],
            [
                'added_at' => now(),
            ]
        );

        $favorite->load(['product.category', 'product.store']);

        return response()->json([
            'success' => true,
            'message' => 'Đã thêm sản phẩm vào yêu thích.',
            'data' => $favorite,
        ], 201);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        FavoriteProduct::query()
            ->where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa sản phẩm khỏi yêu thích.',
        ]);
    }
}
