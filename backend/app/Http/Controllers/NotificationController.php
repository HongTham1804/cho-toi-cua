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
            'message' => 'Lay danh sach thong bao thanh cong.',
            'data' => $notifications,
        ]);
    }

    public function markRead(Request $request, AppNotification $notification): JsonResponse
    {
        $user = $request->user();

        if ($user?->role !== 'admin' && (int) $notification->user_id !== (int) $user?->id) {
            return response()->json([
                'message' => 'Ban khong co quyen cap nhat thong bao nay.',
            ], 403);
        }

        $notification->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Da danh dau thong bao la da doc.',
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
            'message' => 'Da danh dau tat ca thong bao la da doc.',
        ]);
    }
}
