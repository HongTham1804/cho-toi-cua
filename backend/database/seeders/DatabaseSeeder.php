<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Khách hàng mẫu',
                'password' => bcrypt('password'),
            ]
        );

        $catRau = Category::firstOrCreate(
            ['slug' => 'rau-cu-qua-sach'],
            [
                'name' => 'Rau củ quả sạch',
                'image_url' => 'rau.jpg',
            ]
        );

        $catThit = Category::firstOrCreate(
            ['slug' => 'thit-ca-tuoi-song'],
            [
                'name' => 'Thịt cá tươi sống',
                'image_url' => 'thit.jpg',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Cà chua Đà Lạt'],
            [
                'store_id' => 1,
                'category_id' => $catRau->id,
                'original_price' => 15000,
                'price' => 20000,
                'stock' => 100,
                'is_active' => true,
                'description' => 'Cà chua organic tươi ngon sạch sẽ.',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Bắp cải trắng'],
            [
                'store_id' => 1,
                'category_id' => $catRau->id,
                'original_price' => 12000,
                'price' => 18000,
                'stock' => 50,
                'is_active' => true,
                'description' => 'Bắp cải cuộn chặt, giòn ngọt.',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Thịt ba chỉ heo'],
            [
                'store_id' => 1,
                'category_id' => $catThit->id,
                'original_price' => 95000,
                'price' => 125000,
                'discount_price' => 115000,
                'stock' => 30,
                'is_active' => true,
                'description' => 'Thịt heo tươi nhập trong ngày.',
            ]
        );

        $this->call(OrderSeeder::class);
    }
}
