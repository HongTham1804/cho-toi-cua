<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->integer('user_id');

        $notifications = AppNotification::query()
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->latest()
            ->limit(100)
            ->get();

        return response()->json([
            'message' => 'Lay danh sach thong bao thanh cong.',
            'data' => $notifications,
        ]);
    }

    public function markRead(AppNotification $notification): JsonResponse
    {
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
        $userId = $request->integer('user_id');

        AppNotification::query()
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Da danh dau tat ca thong bao la da doc.',
        ]);
    }
}
