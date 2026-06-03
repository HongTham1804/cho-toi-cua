<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class VoucherController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return Cache::remember('vouchers:index:' . md5($request->fullUrl()), now()->addSeconds(30), function () use ($request) {
        $userId = $request->user()?->id;
        $savedVoucherStates = $this->savedVoucherStates($userId);

        $vouchers = Voucher::with('store')
            ->withCount('users')
            ->when($request->filled('store_id'), function ($query) use ($request) {
                $query->where('store_id', $request->query('store_id'));
            })
            ->orderByRaw("FIELD(discount_type, 'freeship', 'fixed', 'percentage')")
            ->orderBy('min_order_value')
            ->get()
            ->map(function (Voucher $voucher) use ($savedVoucherStates) {
                return $this->formatVoucher($voucher, $savedVoucherStates);
            });

        return response()->json([
            'message' => 'Lấy danh sách voucher thành công.',
            'data' => $vouchers,
        ]);
        });
    }

    public function save(Request $request, Voucher $voucher): JsonResponse
    {
        if (! $voucher->isActive()) {
            return response()->json([
                'message' => 'Voucher đã hết hạn hoặc hết lượt sử dụng.',
            ], 422);
        }

        if ($voucher->usage_limit > 0 && $voucher->users()->count() >= $voucher->usage_limit) {
            return response()->json([
                'message' => 'Voucher đã hết lượt lưu.',
            ], 422);
        }

        $user = $request->user();
        $existingVoucher = $user->vouchers()
            ->where('vouchers.id', $voucher->id)
            ->first();

        if ($existingVoucher && (bool) $existingVoucher->pivot->is_used) {
            return response()->json([
                'message' => 'Voucher này đã được sử dụng.',
            ], 422);
        }

        $user->vouchers()->syncWithoutDetaching([
            $voucher->id => ['is_used' => false],
        ]);
        Cache::flush();

        return response()->json([
            'message' => 'Đã lưu voucher vào ví.',
            'data' => $this->formatVoucher($voucher->fresh('store')->loadCount('users'), [$voucher->id => false]),
        ]);
    }

    public function unsave(Request $request, Voucher $voucher): JsonResponse
    {
        $user = $request->user();
        $existingVoucher = $user->vouchers()
            ->where('vouchers.id', $voucher->id)
            ->first();

        if ($existingVoucher && (bool) $existingVoucher->pivot->is_used) {
            return response()->json([
                'message' => 'Voucher đã sử dụng nên không thể bỏ lưu.',
            ], 422);
        }

        $user->vouchers()->detach($voucher->id);
        Cache::flush();

        return response()->json([
            'message' => 'Đã bỏ lưu voucher.',
            'data' => $this->formatVoucher($voucher->fresh('store')->loadCount('users')),
        ]);
    }

    public function userVouchers(Request $request): JsonResponse
    {
        return Cache::remember('user-vouchers:index:' . md5($request->fullUrl()), now()->addSeconds(30), function () use ($request) {
        $data = $request->validate([
            'store_id' => ['nullable', 'exists:stores,id'],
        ]);

        $user = $request->user();

        $vouchers = $user->vouchers()
            ->with('store')
            ->withCount('users')
            ->when(isset($data['store_id']), function ($query) use ($data) {
                $query->where('store_id', $data['store_id']);
            })
            ->wherePivot('is_used', false)
            ->orderByRaw("FIELD(discount_type, 'freeship', 'fixed', 'percentage')")
            ->get()
            ->map(fn (Voucher $voucher) => $this->formatVoucher($voucher, [
                $voucher->id => (bool) $voucher->pivot->is_used,
            ]));

        return response()->json([
            'message' => 'Lấy ví voucher thành công.',
            'data' => $vouchers,
        ]);
        });
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
