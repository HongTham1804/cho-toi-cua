<?php

namespace Database\Seeders;

use App\Models\FlashSale;
use App\Models\Product;
use App\Models\Store;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $stores = Store::query()
            ->whereIn('id', [1, 2, 3])
            ->get();

        foreach ($stores as $store) {
            $prefix = match ((int) $store->id) {
                2 => 'WM',
                3 => 'GO',
                default => 'BHX',
            };

            $voucherTemplates = [
                [
                    'code' => "{$prefix}FREESHIP15",
                    'title' => 'Giảm 15k phí ship',
                    'description' => 'Đơn tối thiểu 150k',
                    'discount_type' => 'freeship',
                    'discount_amount' => 15000,
                    'max_discount_amount' => 15000,
                    'usage_limit' => 100,
                    'min_order_value' => 150000,
                ],
                [
                    'code' => "{$prefix}SAVE20K",
                    'title' => 'Giảm 20k cho đơn từ 200k',
                    'description' => 'Áp dụng cho đơn đủ điều kiện',
                    'discount_type' => 'fixed',
                    'discount_amount' => 20000,
                    'max_discount_amount' => 20000,
                    'usage_limit' => 120,
                    'min_order_value' => 200000,
                ],
                [
                    'code' => "{$prefix}RAU10",
                    'title' => 'Giảm 10% tối đa 50k',
                    'description' => 'Ưu đãi rau củ và thực phẩm tươi',
                    'discount_type' => 'percentage',
                    'discount_amount' => 10,
                    'max_discount_amount' => 50000,
                    'usage_limit' => 80,
                    'min_order_value' => 250000,
                ],
                [
                    'code' => "{$prefix}BIG50K",
                    'title' => 'Giảm 50k cho đơn từ 1 triệu',
                    'description' => 'Dành cho đơn hàng lớn',
                    'discount_type' => 'fixed',
                    'discount_amount' => 50000,
                    'max_discount_amount' => 50000,
                    'usage_limit' => 40,
                    'min_order_value' => 1000000,
                ],
                [
                    'code' => "{$prefix}FREESHIP25",
                    'title' => 'Giảm 25k phí ship',
                    'description' => 'Đơn tối thiểu 300k',
                    'discount_type' => 'freeship',
                    'discount_amount' => 25000,
                    'max_discount_amount' => 25000,
                    'usage_limit' => 70,
                    'min_order_value' => 300000,
                ],
                [
                    'code' => "{$prefix}FREESHIPFULL",
                    'title' => 'Miễn phí vận chuyển',
                    'description' => 'Đơn tối thiểu 500k',
                    'discount_type' => 'freeship',
                    'discount_amount' => 50000,
                    'max_discount_amount' => 50000,
                    'usage_limit' => 35,
                    'min_order_value' => 500000,
                ],
                [
                    'code' => "{$prefix}SAVE10K",
                    'title' => 'Giảm 10k cho đơn từ 99k',
                    'description' => 'Ưu đãi đơn hàng nhỏ',
                    'discount_type' => 'fixed',
                    'discount_amount' => 10000,
                    'max_discount_amount' => 10000,
                    'usage_limit' => 150,
                    'min_order_value' => 99000,
                ],
                [
                    'code' => "{$prefix}SAVE30K",
                    'title' => 'Giảm 30k cho đơn từ 350k',
                    'description' => 'Áp dụng cho mọi ngành hàng',
                    'discount_type' => 'fixed',
                    'discount_amount' => 30000,
                    'max_discount_amount' => 30000,
                    'usage_limit' => 90,
                    'min_order_value' => 350000,
                ],
                [
                    'code' => "{$prefix}SAVE70K",
                    'title' => 'Giảm 70k cho đơn từ 1.5 triệu',
                    'description' => 'Dành cho đơn hàng gia đình',
                    'discount_type' => 'fixed',
                    'discount_amount' => 70000,
                    'max_discount_amount' => 70000,
                    'usage_limit' => 25,
                    'min_order_value' => 1500000,
                ],
                [
                    'code' => "{$prefix}FRESH5",
                    'title' => 'Giảm 5% tối đa 25k',
                    'description' => 'Ưu đãi thực phẩm tươi',
                    'discount_type' => 'percentage',
                    'discount_amount' => 5,
                    'max_discount_amount' => 25000,
                    'usage_limit' => 120,
                    'min_order_value' => 180000,
                ],
                [
                    'code' => "{$prefix}FRESH15",
                    'title' => 'Giảm 15% tối đa 60k',
                    'description' => 'Ưu đãi rau củ, thịt cá',
                    'discount_type' => 'percentage',
                    'discount_amount' => 15,
                    'max_discount_amount' => 60000,
                    'usage_limit' => 60,
                    'min_order_value' => 400000,
                ],
                [
                    'code' => "{$prefix}DRINK12",
                    'title' => 'Giảm 12% tối đa 40k',
                    'description' => 'Ưu đãi sữa và đồ uống',
                    'discount_type' => 'percentage',
                    'discount_amount' => 12,
                    'max_discount_amount' => 40000,
                    'usage_limit' => 75,
                    'min_order_value' => 300000,
                ],
                [
                    'code' => "{$prefix}DRY8",
                    'title' => 'Giảm 8% tối đa 35k',
                    'description' => 'Ưu đãi bánh kẹo, thực phẩm khô',
                    'discount_type' => 'percentage',
                    'discount_amount' => 8,
                    'max_discount_amount' => 35000,
                    'usage_limit' => 100,
                    'min_order_value' => 220000,
                ],
                [
                    'code' => "{$prefix}CLEAN18",
                    'title' => 'Giảm 18% tối đa 55k',
                    'description' => 'Ưu đãi hóa phẩm, chăm sóc cá nhân',
                    'discount_type' => 'percentage',
                    'discount_amount' => 18,
                    'max_discount_amount' => 55000,
                    'usage_limit' => 50,
                    'min_order_value' => 450000,
                ],
                [
                    'code' => "{$prefix}MEGA100K",
                    'title' => 'Giảm 100k cho đơn từ 2 triệu',
                    'description' => 'Mã số lượng giới hạn',
                    'discount_type' => 'fixed',
                    'discount_amount' => 100000,
                    'max_discount_amount' => 100000,
                    'usage_limit' => 15,
                    'min_order_value' => 2000000,
                ],
            ];

            foreach ($voucherTemplates as $voucher) {
                Voucher::updateOrCreate(
                    ['code' => $voucher['code']],
                    [
                        ...$voucher,
                        'store_id' => $store->id,
                        'used_count' => 0,
                        'start_date' => now()->subDay(),
                        'end_date' => now()->addMonth(),
                    ]
                );
            }
        }

        FlashSale::query()->delete();

        $weekdayNames = [
            1 => 'Thứ 2',
            2 => 'Thứ 3',
            3 => 'Thứ 4',
            4 => 'Thứ 5',
            5 => 'Thứ 6',
            6 => 'Thứ 7',
            7 => 'Chủ nhật',
        ];

        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);

        foreach ($weekdayNames as $dayNumber => $dayName) {
            $startTime = $startOfWeek->copy()->addDays($dayNumber - 1)->setTime(10, 0);
            $endTime = $startOfWeek->copy()->addDays($dayNumber - 1)->setTime(13, 0);
            $status = match (true) {
                now()->lt($startTime) => 'upcoming',
                now()->gt($endTime) => 'ended',
                default => 'active',
            };

            $flashSale = FlashSale::updateOrCreate(
                ['name' => "Giờ Vàng Giá Sốc {$dayName}"],
                [
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'status' => $status,
                ]
            );

            $flashSale->products()->delete();

            $productsForDay = collect();

            foreach ([1, 2, 3] as $storeId) {
                $storeProducts = Product::query()
                    ->where('store_id', $storeId)
                    ->where('is_active', true)
                    ->orderBy('id')
                    ->get()
                    ->values();

                if ($storeProducts->isEmpty()) {
                    continue;
                }

                $offset = (($dayNumber - 1) * 5) % max(1, $storeProducts->count());

                for ($index = 0; $index < min(8, $storeProducts->count()); $index++) {
                    $productsForDay->push($storeProducts[($offset + $index) % $storeProducts->count()]);
                }
            }

            $productsForDay->values()->each(function (Product $product, int $index) use ($flashSale) {
                $basePrice = (float) ($product->original_price ?: $product->price);
                $discountPercent = [12, 15, 18, 20, 25, 28][$index % 6];
                $flashPrice = round(($basePrice * (100 - $discountPercent)) / 100 / 1000) * 1000;
                $quantity = 30 + (($index % 4) * 10);
                $sold = min($quantity - 1, 6 + (($index % 6) * 5));

                $flashSale->products()->create([
                    'product_id' => $product->id,
                    'flash_sale_price' => max(1000, $flashPrice),
                    'quantity' => $quantity,
                    'sold' => $sold,
                ]);
            });
        }
    }
}
