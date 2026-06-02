<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $wallet = Wallet::firstOrCreate(
            ['user_id' => (int) $data['user_id']],
            ['balance' => 0]
        );

        return response()->json([
            'message' => 'Lấy ví thành công.',
            'data' => $this->walletPayload($wallet),
        ]);
    }

    public function topUp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'amount' => ['required', 'numeric', 'min:1000'],
        ]);

        $wallet = DB::transaction(function () use ($data) {
            $wallet = Wallet::firstOrCreate(
                ['user_id' => (int) $data['user_id']],
                ['balance' => 0]
            );
            $wallet = Wallet::whereKey($wallet->id)->lockForUpdate()->firstOrFail();
            $nextBalance = (float) $wallet->balance + (float) $data['amount'];

            $wallet->update(['balance' => $nextBalance]);
            $wallet->transactions()->create([
                'type' => 'topup',
                'amount' => (float) $data['amount'],
                'balance_after' => $nextBalance,
                'description' => 'Nạp tiền ví giả lập',
                'metadata' => ['source' => 'simulation'],
            ]);

            return $wallet->fresh();
        });

        return response()->json([
            'message' => 'Nạp tiền ví thành công.',
            'data' => $this->walletPayload($wallet),
        ]);
    }

    private function walletPayload(Wallet $wallet): array
    {
        $wallet->load(['transactions' => function ($query) {
            $query->latest()->limit(20);
        }]);

        return [
            'id' => $wallet->id,
            'user_id' => $wallet->user_id,
            'balance' => (float) $wallet->balance,
            'transactions' => $wallet->transactions->map(fn ($transaction) => [
                'id' => $transaction->id,
                'order_id' => $transaction->order_id,
                'type' => $transaction->type,
                'amount' => (float) $transaction->amount,
                'balance_after' => (float) $transaction->balance_after,
                'description' => $transaction->description,
                'metadata' => $transaction->metadata,
                'created_at' => $transaction->created_at,
            ])->values(),
        ];
    }
}
