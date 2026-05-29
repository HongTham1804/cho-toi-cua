<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customerId = $this->getOrCreateCustomerId();
        $products = $this->getProducts();

        // 1. ĐƠN HÀNG 1: Chờ xử lý (pending)
        // Dùng sản phẩm 1 (hoặc mặc định)
        $p1 = $products[0] ?? null;
        $p1Id = $p1?->id ?? 1;
        $p1StoreId = $p1?->store_id ?? 1;
        $p1Price = (float) ($p1?->discount_price ?? $p1?->price ?? 20000);
        $p1OrigPrice = (float) ($p1?->original_price ?? 15000);
        $q1 = 2;
        $ship1 = 15000;
        $sub1 = $p1Price * $q1;

        $order1 = DB::table('orders')->insertGetId([
            'customer_id' => $customerId,
            'store_id' => $p1StoreId,
            'shipper_id' => null,
            'voucher_id' => null,
            'shipping_fee' => $ship1,
            'subtotal' => $sub1,
            'total_amount' => $sub1 + $ship1,
            'shipping_address' => '123 Nguyen Trai, Quan 5, TP.HCM',
            'payment_method' => 'cod',
            'status' => 'pending',
            'created_at' => now()->subHours(1),
            'updated_at' => now()->subHours(1),
        ]);

        DB::table('order_details')->insert([
            'order_id' => $order1,
            'product_id' => $p1Id,
            'quantity' => $q1,
            'unit_price' => $p1Price,
            'original_price' => $p1OrigPrice,
            'is_flash_sale' => false,
            'created_at' => now()->subHours(1),
            'updated_at' => now()->subHours(1),
        ]);


        // 2. ĐƠN HÀNG 2: Đang lấy hàng (preparing)
        // Dùng sản phẩm 2 (hoặc mặc định)
        $p2 = $products[1] ?? $p1;
        $p2Id = $p2?->id ?? 2;
        $p2StoreId = $p2?->store_id ?? 1;
        $p2Price = (float) ($p2?->discount_price ?? $p2?->price ?? 18000);
        $p2OrigPrice = (float) ($p2?->original_price ?? 12000);
        $q2 = 3;
        $ship2 = 20000;
        $sub2 = $p2Price * $q2;

        $order2 = DB::table('orders')->insertGetId([
            'customer_id' => $customerId,
            'store_id' => $p2StoreId,
            'shipper_id' => null,
            'voucher_id' => null,
            'shipping_fee' => $ship2,
            'subtotal' => $sub2,
            'total_amount' => $sub2 + $ship2,
            'shipping_address' => '456 Tran Hung Dao, Quan 1, TP.HCM',
            'payment_method' => 'momo',
            'status' => 'preparing',
            'created_at' => now()->subHours(4),
            'updated_at' => now()->subHours(4),
        ]);

        DB::table('order_details')->insert([
            'order_id' => $order2,
            'product_id' => $p2Id,
            'quantity' => $q2,
            'unit_price' => $p2Price,
            'original_price' => $p2OrigPrice,
            'is_flash_sale' => false,
            'created_at' => now()->subHours(4),
            'updated_at' => now()->subHours(4),
        ]);


        // 3. ĐƠN HÀNG 3: Đang giao (shipping)
        // Dùng sản phẩm 3 (hoặc mặc định)
        $p3 = $products[2] ?? $p1;
        $p3Id = $p3?->id ?? 3;
        $p3StoreId = $p3?->store_id ?? 1;
        $p3Price = (float) ($p3?->discount_price ?? $p3?->price ?? 115000);
        $p3OrigPrice = (float) ($p3?->original_price ?? 95000);
        $q3 = 1;
        $ship3 = 12000;
        $sub3 = $p3Price * $q3;

        $order3 = DB::table('orders')->insertGetId([
            'customer_id' => $customerId,
            'store_id' => $p3StoreId,
            'shipper_id' => null,
            'voucher_id' => null,
            'shipping_fee' => $ship3,
            'subtotal' => $sub3,
            'total_amount' => $sub3 + $ship3,
            'shipping_address' => '789 Dien Bien Phu, Binh Thanh, TP.HCM',
            'payment_method' => 'bank_transfer',
            'status' => 'shipping',
            'created_at' => now()->subDays(1),
            'updated_at' => now()->subDays(1),
        ]);

        DB::table('order_details')->insert([
            'order_id' => $order3,
            'product_id' => $p3Id,
            'quantity' => $q3,
            'unit_price' => $p3Price,
            'original_price' => $p3OrigPrice,
            'is_flash_sale' => false,
            'created_at' => now()->subDays(1),
            'updated_at' => now()->subDays(1),
        ]);


        // 4. ĐƠN HÀNG 4: Hoàn thành (completed)
        // Đơn hàng này mua 2 sản phẩm khác nhau (sản phẩm 1 và sản phẩm 2)
        $ship4 = 15000;
        $sub4 = ($p1Price * 2) + ($p2Price * 1);

        $order4 = DB::table('orders')->insertGetId([
            'customer_id' => $customerId,
            'store_id' => $p1StoreId,
            'shipper_id' => null,
            'voucher_id' => null,
            'shipping_fee' => $ship4,
            'subtotal' => $sub4,
            'total_amount' => $sub4 + $ship4,
            'shipping_address' => '221B Baker Street, Quan 3, TP.HCM',
            'payment_method' => 'cod',
            'status' => 'completed',
            'created_at' => now()->subDays(3),
            'updated_at' => now()->subDays(3),
        ]);

        DB::table('order_details')->insert([
            [
                'order_id' => $order4,
                'product_id' => $p1Id,
                'quantity' => 2,
                'unit_price' => $p1Price,
                'original_price' => $p1OrigPrice,
                'is_flash_sale' => false,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'order_id' => $order4,
                'product_id' => $p2Id,
                'quantity' => 1,
                'unit_price' => $p2Price,
                'original_price' => $p2OrigPrice,
                'is_flash_sale' => false,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ]
        ]);


        // 5. ĐƠN HÀNG 5: Đã hủy (cancelled)
        // Dùng sản phẩm 3 (hoặc mặc định)
        $q5 = 2;
        $ship5 = 15000;
        $sub5 = $p3Price * $q5;

        $order5 = DB::table('orders')->insertGetId([
            'customer_id' => $customerId,
            'store_id' => $p3StoreId,
            'shipper_id' => null,
            'voucher_id' => null,
            'shipping_fee' => $ship5,
            'subtotal' => $sub5,
            'total_amount' => $sub5 + $ship5,
            'shipping_address' => '99 Cong Hoa, Tan Binh, TP.HCM',
            'payment_method' => 'cod',
            'status' => 'cancelled',
            'created_at' => now()->subDays(7),
            'updated_at' => now()->subDays(7),
        ]);

        DB::table('order_details')->insert([
            'order_id' => $order5,
            'product_id' => $p3Id,
            'quantity' => $q5,
            'unit_price' => $p3Price,
            'original_price' => $p3OrigPrice,
            'is_flash_sale' => false,
            'created_at' => now()->subDays(7),
            'updated_at' => now()->subDays(7),
        ]);
    }

    private function getOrCreateCustomerId(): int
    {
        $user = DB::table('users')->where('email', 'order.customer@example.com')->first();

        if ($user) {
            return $user->id;
        }

        return DB::table('users')->insertGetId([
            'name' => 'Khach hang dat don',
            'email' => 'order.customer@example.com',
            'password' => bcrypt('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function getProducts(): array
    {
        if (! Schema::hasTable('products')) {
            return [];
        }

        return DB::table('products')->orderBy('id')->get()->toArray();
    }
}
