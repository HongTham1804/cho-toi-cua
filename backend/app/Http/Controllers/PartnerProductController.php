<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartnerProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $this->isConfiguredPartner($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập kho của siêu thị.',
            ], 403);
        }

        $stores = $user->stores()->select('id', 'name', 'address', 'status')->get();
        $store = $request->filled('store_id')
            ? $stores->firstWhere('id', (int) $request->query('store_id'))
            : $stores->first();

        if (! $store) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy siêu thị thuộc tài khoản đối tác này.',
            ], 404);
        }

        $query = Product::query()
            ->with(['category', 'store'])
            ->where('store_id', $store->id);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        $perPage = (int) $request->query('per_page', 50);
        $perPage = min(max($perPage, 1), 100);

        return response()->json([
            'success' => true,
            'store' => $store,
            'data' => $query
                ->orderBy('updated_at', 'desc')
                ->orderBy('id', 'desc')
                ->paginate($perPage),
        ]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();

        if (! $this->isConfiguredPartner($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền cập nhật kho của siêu thị.',
            ], 403);
        }

        $storeIds = $user->stores()->pluck('id');

        if (! $storeIds->contains((int) $product->store_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm này không thuộc siêu thị của bạn.',
            ], 403);
        }

        $validated = $request->validate([
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'required', 'boolean'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'original_price' => ['sometimes', 'required', 'numeric', 'min:0'],
        ]);

        if ($validated === []) {
            return response()->json([
                'success' => false,
                'message' => 'Không có dữ liệu sản phẩm cần cập nhật.',
            ], 422);
        }

        $updates = $validated;

        if (array_key_exists('original_price', $updates) && $product->discount_price === null) {
            $updates['price'] = $updates['original_price'];
        }

        $product->update($updates);

        return response()->json([
            'success' => true,
            'data' => $product->fresh(['category', 'store']),
        ]);
    }

    private function isConfiguredPartner($user): bool
    {
        if (! $user || $user->role !== 'partner') {
            return false;
        }

        $emails = array_values(array_filter(array_map(
            fn ($email) => strtolower(trim((string) $email)),
            [
                env('PARTNER_BHX_EMAIL'),
                env('PARTNER_WINMART_EMAIL'),
                env('PARTNER_GO_EMAIL'),
            ]
        )));

        return $emails === [] || in_array(strtolower($user->email), $emails, true);
    }
}
