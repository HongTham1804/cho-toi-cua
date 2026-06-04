<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

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

    public function catalog(Request $request, int $id): JsonResponse
    {
        $data = Cache::remember('stores:catalog:' . md5($request->fullUrl()), now()->addSeconds(30), function () use ($request, $id) {
            $store = Store::query()
                ->where('status', 'active')
                ->withCount([
                    'reviews as review_count',
                    'orders as completed_orders_count' => fn (Builder $query) => $query->where('status', 'completed'),
                ])
                ->withAvg('reviews as average_rating', 'rating')
                ->find($id);

            if (! $store) {
                return null;
            }

            $categories = Category::query()->orderBy('id')->get();
            $products = Product::query()
                ->with(['category', 'store'])
                ->where('store_id', $store->id)
                ->latest()
                ->limit(40)
                ->get();
            $this->attachActiveFlashSaleData($products);

            $savedVoucherStates = $this->savedVoucherStates(
                $request->query('user_id') ? (int) $request->query('user_id') : null
            );
            $vouchers = Voucher::query()
                ->with('store')
                ->withCount('users')
                ->where('store_id', $store->id)
                ->orderByRaw("FIELD(discount_type, 'freeship', 'fixed', 'percentage')")
                ->orderBy('min_order_value')
                ->get()
                ->map(fn (Voucher $voucher) => $this->formatVoucher($voucher, $savedVoucherStates));

            $flashSales = $this->flashSalesForStore($store->id);

            return [
                'store' => $store,
                'categories' => $categories,
                'products' => $products,
                'vouchers' => $vouchers,
                'flash_sales' => $flashSales,
            ];
        });

        if (! $data) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy siêu thị.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    private function attachActiveFlashSaleData($products): void
    {
        $activeFlashItems = FlashSaleProduct::query()
            ->with('flashSale')
            ->whereIn('product_id', $products->pluck('id'))
            ->whereHas('flashSale', function ($query) {
                $query->where('status', 'active')
                    ->where('start_time', '<=', now())
                    ->where('end_time', '>=', now());
            })
            ->get()
            ->keyBy('product_id');

        $products->transform(function (Product $product) use ($activeFlashItems) {
            $flashItem = $activeFlashItems->get($product->id);

            $product->setAttribute('is_flash_sale', (bool) $flashItem);
            $product->setAttribute('flash_sale_price', $flashItem ? (float) $flashItem->flash_sale_price : null);
            $product->setAttribute('flash_sale_quantity', $flashItem ? (int) $flashItem->quantity : null);
            $product->setAttribute('flash_sale_sold', $flashItem ? (int) $flashItem->sold : null);
            $product->setAttribute('flash_sale_remaining', $flashItem ? $flashItem->remaining : null);
            $product->setAttribute('flash_sale_sold_percent', $flashItem ? $flashItem->sold_percent : null);
            $product->setAttribute('flash_sale_end_time', $flashItem ? $flashItem->flashSale?->end_time : null);

            return $product;
        });
    }

    private function flashSalesForStore(int $storeId)
    {
        return FlashSale::query()
            ->with([
                'products' => fn ($query) => $query->whereHas('product', fn ($productQuery) => $productQuery->where('store_id', $storeId)),
                'products.product.category',
                'products.product.store',
            ])
            ->where('end_time', '>=', now())
            ->whereHas('products.product', fn ($query) => $query->where('store_id', $storeId))
            ->orderBy('start_time')
            ->get()
            ->map(function (FlashSale $flashSale) {
                $items = $flashSale->products
                    ->filter(fn ($item) => (bool) $item->product)
                    ->values()
                    ->map(fn ($item) => [
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
                    ]);

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
    }

    private function savedVoucherStates(?int $userId): array
    {
        if (! $userId) {
            return [];
        }

        return User::find($userId)?->vouchers()
            ->pluck('user_vouchers.is_used', 'vouchers.id')
            ->mapWithKeys(fn ($isUsed, $voucherId) => [(int) $voucherId => (bool) $isUsed])
            ->all() ?? [];
    }

    private function formatVoucher(Voucher $voucher, array $savedVoucherStates = []): array
    {
        $isUsed = $savedVoucherStates[$voucher->id] ?? false;
        $saved = array_key_exists($voucher->id, $savedVoucherStates) && ! $isUsed;

        return [
            'id' => $voucher->id,
            'store_id' => $voucher->store_id,
            'store_name' => $voucher->store?->name,
            'code' => $voucher->code,
            'title' => $voucher->title,
            'description' => $voucher->description,
            'discount_type' => $voucher->discount_type,
            'discount_amount' => (float) $voucher->discount_amount,
            'max_discount_amount' => $voucher->max_discount_amount ? (float) $voucher->max_discount_amount : null,
            'usage_limit' => $voucher->usage_limit,
            'used_count' => $voucher->used_count,
            'saved_count' => $voucher->users_count ?? 0,
            'min_order_value' => (float) $voucher->min_order_value,
            'start_date' => $voucher->start_date,
            'end_date' => $voucher->end_date,
            'is_active' => $voucher->isActive(),
            'is_saved' => $saved,
            'is_used' => $isUsed,
        ];
    }
}
