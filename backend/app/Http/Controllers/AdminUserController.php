<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipper;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminUserController extends Controller
{
    private const CUSTOMER_CANCEL_RATE_LIMIT = 50;
    private const CUSTOMER_MIN_ORDERS_TO_LOCK = 5;

    public function index(Request $request): JsonResponse
    {
        if ($guard = $this->guardAdmin($request)) {
            return $guard;
        }

        $role = (string) $request->query('role', 'all');
        $status = (string) $request->query('status', 'all');
        $search = Str::lower(trim((string) $request->query('search', '')));
        $perPage = min(max((int) $request->query('per_page', 8), 1), 50);
        $page = max((int) $request->query('page', 1), 1);

        $records = collect();

        if ($role !== 'shipper') {
            $records = $records->merge(
                User::query()
                    ->withCount([
                        'orders as total_orders',
                        'orders as cancelled_orders' => fn ($query) => $query->where('status', 'cancelled'),
                        'orders as completed_orders' => fn ($query) => $query->where('status', 'completed'),
                    ])
                    ->latest()
                    ->get()
                    ->map(fn (User $user) => $this->mapUser($user))
            );
        }

        if (in_array($role, ['all', 'shipper'], true)) {
            $records = $records->merge(
                Shipper::query()
                    ->latest()
                    ->get()
                    ->map(fn (Shipper $shipper) => $this->mapShipper($shipper))
            );
        }

        if ($role !== 'all') {
            $records = $records->filter(fn (array $record) => $record['role_key'] === $role);
        }

        if ($status !== 'all') {
            $records = $records->filter(fn (array $record) => $record['status_key'] === $status);
        }

        if ($search !== '') {
            $records = $records->filter(function (array $record) use ($search) {
                return Str::contains(Str::lower($record['name']), $search)
                    || Str::contains(Str::lower($record['email'] ?? ''), $search)
                    || Str::contains(Str::lower($record['phone'] ?? ''), $search)
                    || Str::contains(Str::lower($record['uid']), $search);
            });
        }

        $records = $records->values();
        $total = $records->count();
        $pageItems = $records->slice(($page - 1) * $perPage, $perPage)->values();

        return response()->json([
            'success' => true,
            'data' => [
                'data' => $pageItems,
                'current_page' => $page,
                'last_page' => (int) max(1, ceil($total / $perPage)),
                'per_page' => $perPage,
                'total' => $total,
            ],
        ]);
    }

    public function show(Request $request, string $type, int $id): JsonResponse
    {
        if ($guard = $this->guardAdmin($request)) {
            return $guard;
        }

        if ($type === 'shipper') {
            $shipper = Shipper::query()
                ->withCount([
                    'orders as total_orders',
                    'orders as completed_orders' => fn ($query) => $query->where('status', 'completed'),
                    'orders as cancelled_orders' => fn ($query) => $query->where('status', 'cancelled'),
                ])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $this->mapShipper($shipper),
            ]);
        }

        $user = User::query()
            ->withCount([
                'orders as total_orders',
                'orders as cancelled_orders' => fn ($query) => $query->where('status', 'cancelled'),
                'orders as completed_orders' => fn ($query) => $query->where('status', 'completed'),
            ])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->mapUser($user),
        ]);
    }

    public function lock(Request $request, string $type, int $id): JsonResponse
    {
        if ($guard = $this->guardAdmin($request)) {
            return $guard;
        }

        if ($type === 'shipper') {
            return response()->json([
                'message' => 'Nhân viên giao hàng hiện là hồ sơ vận chuyển, không có tài khoản đăng nhập để khóa.',
            ], 422);
        }

        $user = User::query()
            ->withCount([
                'orders as total_orders',
                'orders as cancelled_orders' => fn ($query) => $query->where('status', 'cancelled'),
                'orders as completed_orders' => fn ($query) => $query->where('status', 'completed'),
            ])
            ->findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Không thể khóa tài khoản quản trị viên hệ thống.',
            ], 422);
        }

        if ($user->role === 'customer' && ! $this->customerCanBeLocked($user)) {
            return response()->json([
                'message' => sprintf(
                    'Chỉ khóa khách hàng khi có ít nhất %s đơn và tỷ lệ hủy từ %s%% trở lên.',
                    self::CUSTOMER_MIN_ORDERS_TO_LOCK,
                    self::CUSTOMER_CANCEL_RATE_LIMIT
                ),
                'data' => $this->mapUser($user),
            ], 422);
        }

        $user->forceFill([
            'locked_until' => now()->addDays(30),
            'locked_reason' => $user->role === 'customer'
                ? 'Tỷ lệ hủy đơn cao'
                : 'Khóa bởi quản trị viên',
        ])->save();
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã khóa tài khoản trong 30 ngày.',
            'data' => $this->mapUser($user->fresh()->loadCount([
                'orders as total_orders',
                'orders as cancelled_orders' => fn ($query) => $query->where('status', 'cancelled'),
                'orders as completed_orders' => fn ($query) => $query->where('status', 'completed'),
            ])),
        ]);
    }

    public function destroy(Request $request, string $type, int $id): JsonResponse
    {
        if ($guard = $this->guardAdmin($request)) {
            return $guard;
        }

        if ($type === 'shipper') {
            Shipper::findOrFail($id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa hồ sơ nhân viên giao hàng.',
            ]);
        }

        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Không thể xóa tài khoản quản trị viên hệ thống.',
            ], 422);
        }

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa tài khoản người dùng.',
        ]);
    }

    private function mapUser(User $user): array
    {
        $totalOrders = (int) ($user->total_orders ?? 0);
        $cancelledOrders = (int) ($user->cancelled_orders ?? 0);
        $completedOrders = (int) ($user->completed_orders ?? 0);
        $cancelRate = $totalOrders > 0 ? round(($cancelledOrders / $totalOrders) * 100, 1) : 0;
        $lockedUntil = $user->locked_until;
        $isLocked = $user->isLocked();

        return [
            'id' => $user->id,
            'type' => 'user',
            'uid' => $this->formatUserUid($user),
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role_key' => $user->role,
            'role_label' => $this->roleLabel($user->role),
            'status_key' => $isLocked ? 'locked' : 'active',
            'status_label' => $isLocked
                ? 'Bị khóa đến ' . $lockedUntil->format('d/m/Y')
                : 'Đang hoạt động',
            'locked_until' => $lockedUntil,
            'locked_reason' => $user->locked_reason,
            'created_at' => $user->created_at,
            'stats' => [
                'total_orders' => $totalOrders,
                'cancelled_orders' => $cancelledOrders,
                'completed_orders' => $completedOrders,
                'cancel_rate' => $cancelRate,
                'can_lock_for_cancellation' => $user->role === 'customer' && $this->customerCanBeLocked($user),
            ],
        ];
    }

    private function guardAdmin(Request $request): ?JsonResponse
    {
        if ($request->user()?->role === 'admin') {
            return null;
        }

        return response()->json([
            'message' => 'Bạn không có quyền truy cập khu vực quản trị.',
        ], 403);
    }

    private function mapShipper(Shipper $shipper): array
    {
        $totalOrders = (int) ($shipper->total_orders ?? 0);
        $cancelledOrders = (int) ($shipper->cancelled_orders ?? 0);
        $completedOrders = (int) ($shipper->completed_orders ?? 0);

        return [
            'id' => $shipper->id,
            'type' => 'shipper',
            'uid' => '#SH' . str_pad((string) $shipper->id, 4, '0', STR_PAD_LEFT),
            'name' => $shipper->name,
            'email' => null,
            'phone' => $shipper->phone,
            'role_key' => 'shipper',
            'role_label' => 'Nhân viên giao hàng',
            'status_key' => 'active',
            'status_label' => 'Đang hoạt động',
            'license_plate' => $shipper->license_plate,
            'created_at' => $shipper->created_at,
            'stats' => [
                'total_orders' => $totalOrders,
                'cancelled_orders' => $cancelledOrders,
                'completed_orders' => $completedOrders,
                'cancel_rate' => 0,
                'can_lock_for_cancellation' => false,
            ],
        ];
    }

    private function customerCanBeLocked(User $user): bool
    {
        $totalOrders = (int) ($user->total_orders ?? 0);
        $cancelledOrders = (int) ($user->cancelled_orders ?? 0);
        $cancelRate = $totalOrders > 0 ? ($cancelledOrders / $totalOrders) * 100 : 0;

        return $totalOrders >= self::CUSTOMER_MIN_ORDERS_TO_LOCK
            && $cancelRate >= self::CUSTOMER_CANCEL_RATE_LIMIT;
    }

    private function formatUserUid(User $user): string
    {
        return match ($user->role) {
            'admin' => '#AD' . str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
            'partner' => '#PT' . str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
            default => '#CU' . str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
        };
    }

    private function roleLabel(string $role): string
    {
        return match ($role) {
            'admin' => 'Quản trị viên',
            'partner' => 'Đối tác',
            default => 'Khách hàng',
        };
    }
}
