<?php

namespace App\Http\Controllers;

use App\Models\FlashSale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FlashSaleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $now = now();

        Cache::remember('flash-sales:status-sync:' . $now->format('YmdHi'), now()->addSeconds(70), function () use ($now) {
            FlashSale::query()
                ->where('end_time', '<', $now)
                ->where('status', '!=', 'ended')
                ->update(['status' => 'ended']);

            FlashSale::query()
                ->where('start_time', '<=', $now)
                ->where('end_time', '>=', $now)
                ->where('status', '!=', 'active')
                ->update(['status' => 'active']);

            FlashSale::query()
                ->where('start_time', '>', $now)
                ->where('status', '!=', 'upcoming')
                ->update(['status' => 'upcoming']);

            return true;
        });

        $flashSales = Cache::remember('flash-sales:index:' . md5($request->fullUrl()), now()->addSeconds(30), function () use ($request) {
            $storeId = $request->filled('store_id') ? (int) $request->query('store_id') : null;

            return FlashSale::with([
                'products' => function ($query) use ($storeId) {
                    if ($storeId) {
                        $query->whereHas('product', fn ($productQuery) => $productQuery->where('store_id', $storeId));
                    }
                },
                'products.product.category',
                'products.product.store',
            ])
            ->when($storeId, function ($query) use ($storeId) {
                $query->whereHas('products.product', fn ($productQuery) => $productQuery->where('store_id', $storeId));
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                if ($request->query('status') === 'all') {
                    return;
                }

                $statuses = collect(explode(',', (string) $request->query('status')))
                    ->map(fn ($status) => trim($status))
                    ->filter()
                    ->values();

                if ($statuses->isEmpty()) {
                    return;
                }

                if ($statuses->count() > 1) {
                    $query->whereIn('status', $statuses);
                    return;
                }

                $query->where('status', $statuses->first());
            }, function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('start_time')
            ->get()
            ->map(function (FlashSale $flashSale) use ($request) {
                $items = $flashSale->products
                    ->filter(function ($item) use ($request) {
                        if (! $item->product) {
                            return false;
                        }

                        if ($request->filled('store_id')) {
                            return (int) $item->product->store_id === (int) $request->query('store_id');
                        }

                        return true;
                    })
                    ->values()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'flash_sale_id' => $item->flash_sale_id,
                            'product_id' => $item->product_id,
                            'flash_sale_price' => (float) $item->flash_sale_price,
                            'original_price' => (float) ($item->product->original_price ?? $item->product->price),
                            'quantity' => $item->quantity,
                            'sold' => $item->sold,
                            'remaining' => $item->remaining,
                            'sold_percent' => $item->sold_percent,
                            'product' => $item->product,
                        ];
                    });

                return [
                    'id' => $flashSale->id,
                    'name' => $flashSale->name,
                    'start_time' => $flashSale->start_time,
                    'end_time' => $flashSale->end_time,
                    'status' => $flashSale->status,
                    'products' => $items,
                ];
            })
            ->filter(fn ($flashSale) => $flashSale['products']->isNotEmpty())
            ->values();
        });

        return response()->json([
            'message' => 'Lấy flash sale thành công.',
            'data' => $flashSales,
        ]);
    }
}
