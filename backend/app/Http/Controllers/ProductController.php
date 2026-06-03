<?php

namespace App\Http\Controllers;

use App\Models\FlashSaleProduct;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    /**
     * API Lấy danh sách sản phẩm (Tích hợp tìm kiếm, lọc & sắp xếp)
     * Phục vụ cho trang chủ của khách hàng dựa trên các query params.
     */
    public function index(Request $request)
    {
        return Cache::remember('products:index:' . md5($request->fullUrl()), now()->addSeconds(60), function () use ($request) {
        // Khởi tạo query và chỉ lấy các sản phẩm đang được bật bán (true)
        $query = Product::query()
            ->with(['category', 'store']);

        // 1. Xử lý Tìm kiếm & Lọc (Filter) theo yêu cầu
        if ($request->has('search') && $request->search != '') {
            $search = trim((string) $request->search);
            $searchId = preg_replace('/\D+/', '', $search);

            $query->where(function ($query) use ($search, $searchId) {
                $query->where('name', 'like', '%' . $search . '%');

                if ($searchId !== '') {
                    $query->orWhere('id', (int) $searchId);
                }
            });
        }

        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('store_id') && $request->store_id != '') {
            $query->where('store_id', $request->store_id);
        }

        if ($request->has('stock_status') && $request->stock_status != '') {
            if ($request->stock_status === 'available') {
                $query->where('is_active', true)->where('stock', '>', 0);
            }

            if ($request->stock_status === 'out_of_stock') {
                $query->where(function ($query) {
                    $query->where('is_active', false)
                        ->orWhere('stock', '<=', 0);
                });
            }
        }

        if ($request->has('min_price') && $request->min_price != '') {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && $request->max_price != '') {
            $query->where('price', '<=', $request->max_price);
        }

        // 2. Xử lý Sắp xếp (Sort) [cite: 202]
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                default:
                    $query->latest();
                    break;
            }
        } else {
            // Mặc định lấy sản phẩm mới nhất nếu không truyền tham số sort
            $query->latest();
        }

        $perPage = (int) $request->query('per_page', 25);
        $perPage = min(max($perPage, 1), 200);

        $products = $request->boolean('simple')
            ? $query->limit($perPage)->get()
            : $query->paginate($perPage);
        $productCollection = $request->boolean('simple')
            ? $products
            : $products->getCollection();
        $productIds = $productCollection->pluck('id');
        $activeFlashItems = FlashSaleProduct::query()
            ->with('flashSale')
            ->whereIn('product_id', $productIds)
            ->whereHas('flashSale', function ($query) {
                $query->where('status', 'active')
                    ->where('start_time', '<=', now())
                    ->where('end_time', '>=', now());
            })
            ->get()
            ->keyBy('product_id');

        $productCollection->transform(function (Product $product) use ($activeFlashItems) {
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

        if (! $request->boolean('simple')) {
            $products->setCollection($productCollection);
        }

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
        });
    }

    /**
     * API Thêm sản phẩm mới (Dành cho Siêu thị / Đối tác)
     * Sử dụng StoreProductRequest để tự động validate dữ liệu đầu vào.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());
        Cache::flush();

        return response()->json([
            'success' => true,
            'data' => $product->load(['category', 'store'])
        ], 201);
    }

    /**
     * API Xem chi tiết thông tin của 1 sản phẩm
     */
    public function show($id)
    {
        $product = Product::with(['category', 'store', 'reviews.user:id,name'])
            ->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $reviews = $product->reviews
            ->sortByDesc('created_at')
            ->values()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => (int) $review->rating,
                    'comment' => $review->comment,
                    'user_name' => $review->user?->name ?? 'Khách hàng',
                    'created_at' => $review->created_at,
                ];
            });

        $reviewCount = $reviews->count();
        $averageRating = $reviewCount > 0
            ? round($reviews->avg('rating'), 1)
            : 0;

        $product->setAttribute('review_summary', [
            'count' => $reviewCount,
            'average_rating' => $averageRating,
        ]);
        $product->setRelation('reviews', $reviews);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * API Cập nhật thông tin sản phẩm (Dành cho Siêu thị / Đối tác)
     * Sử dụng UpdateProductRequest để chặn lỗi dữ liệu khi chỉnh sửa.
     */
    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm trên hệ thống'
            ], 404);
        }

        $product->update($request->validated());
        Cache::flush();

        return response()->json([
            'success' => true,
            'data' => $product->fresh()->load(['category', 'store'])
        ]);
    }

    /**
     * API Xóa mềm sản phẩm
     * Hệ thống sử dụng SoftDeletes để đảm bảo an toàn dữ liệu lịch sử đơn hàng.
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm để xóa'
            ], 404);
        }

        $product->delete();
        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa mềm sản phẩm thành công'
        ]);
    }
}
