<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Tạo tài khoản mẫu (để không bị lỗi khóa ngoại)
        $user = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Khách hàng mẫu',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Tạo 2 danh mục mẫu
        $catRau = Category::firstOrCreate(
            ['slug' => 'rau-cu-qua-sach'],
            [
                'name' => 'Rau Củ Quả Sạch',
                'image_url' => 'rau.jpg'
            ]
        );

        $catThit = Category::firstOrCreate(
            ['slug' => 'thit-ca-tuoi-song'],
            [
                'name' => 'Thịt Cá Tươi Sống',
                'image_url' => 'thit.jpg'
            ]
        );

        // 3. Tạo các sản phẩm mẫu để test bộ lọc (Filter)
        Product::firstOrCreate(
            ['name' => 'Cà Chua Đà Lạt'],
            [
                'store_id' => 1,
                'category_id' => $catRau->id,
                'original_price' => 15000,
                'price' => 20000,
                'stock' => 100,
                'description' => 'Cà chua organic tươi ngon sạch sẽ.'
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Bắp Cải Trắng'],
            [
                'store_id' => 1,
                'category_id' => $catRau->id,
                'original_price' => 12000,
                'price' => 18000,
                'stock' => 50,
                'description' => 'Bắp cải cuộn chặt, giòn ngọt.'
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Thịt Ba Chỉ Heo'],
            [
                'store_id' => 1,
                'category_id' => $catThit->id,
                'original_price' => 95000,
                'price' => 125000,
                'discount_price' => 115000, // Có giá giảm
                'stock' => 30,
                'description' => 'Thịt heo tươi nhập trong ngày.'
            ]
        );

        // 4. Gọi OrderSeeder để tạo đơn hàng mẫu và chi tiết đơn hàng mẫu
        $this->call(OrderSeeder::class);
    }
}