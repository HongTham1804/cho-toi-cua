<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = AppNotification::query()
            ->when($user?->role !== 'admin', fn ($query) => $query->where('user_id', $user->id))
            ->latest()
            ->limit(100)
            ->get();

        return response()->json([
            'message' => 'Lấy danh sách thông báo thành công.',
            'data' => $notifications,
        ]);
    }

    public function markRead(Request $request, AppNotification $notification): JsonResponse
    {
        $user = $request->user();

        if ($user?->role !== 'admin' && (int) $notification->user_id !== (int) $user?->id) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật thông báo này.',
            ], 403);
        }

        $notification->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Đã đánh dấu thông báo là đã đọc.',
            'data' => $notification->fresh(),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $user = $request->user();

        AppNotification::query()
            ->when($user?->role !== 'admin', fn ($query) => $query->where('user_id', $user->id))
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Đã đánh dấu tất cả thông báo là đã đọc.',
        ]);
    }
}
