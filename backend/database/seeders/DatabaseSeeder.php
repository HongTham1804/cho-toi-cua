<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
// use App\Models\Store; // Tạm tắt để chờ code của Anh Thư gộp vào
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Tạo tài khoản đối tác mẫu
        $partner = User::firstOrCreate(
            ['email' => 'bachhoaxanh@gmail.com'],
            [
                'name' => 'Đối tác Bách Hóa Xanh',
                'password' => bcrypt('password'),
                'phone' => '0909123456',
                'address' => '123 Nguyễn Thị Minh Khai, Q3',
                'role' => 'partner'
            ]
        );

        // 2. TẠM ẨN TOÀN BỘ KHỐI CODE NÀY - Tránh lỗi Class Store not found khi chưa gộp code của Anh Thư
        /*
        $store = Store::firstOrCreate(
            ['partner_id' => $partner->id],
            [
                'name' => 'Bách Hóa Xanh - Toàn Quốc',
                'address' => 'Số 10 Hùng Vương, Q5',
                'logo_url' => 'bhx_logo.png',
                'status' => 'active'
            ]
        );
        */

        // 3. Tạo 2 danh mục mẫu
        $catRau = Category::create([
            'name' => 'Rau Củ Quả Sạch',
            'slug' => 'rau-cu-qua-sach',
            'image_url' => 'rau.jpg'
        ]);

        $catThit = Category::create([
            'name' => 'Thịt Cá Tươi Sống',
            'slug' => 'thit-ca-tuoi-song',
            'image_url' => 'thit.jpg'
        ]);

        // 4. Tạo các sản phẩm mẫu để test bộ lọc (Filter)
        Product::create([
            'store_id' => 1, // Dùng số 1 ảo vì đã tắt khóa ngoại ở migration
            'category_id' => $catRau->id,
            'name' => 'Cà Chua Đà Lạt',
            'original_price' => 15000,
            'price' => 20000,
            'stock' => 100,
            'description' => 'Cà chua organic tươi ngon sạch sẽ.'
        ]);

        Product::create([
            'store_id' => 1, // Dùng số 1 ảo
            'category_id' => $catRau->id,
            'name' => 'Bắp Cải Trắng',
            'original_price' => 12000,
            'price' => 18000,
            'stock' => 50,
            'description' => 'Bắp cải cuộn chặt, giòn ngọt.'
        ]);

        Product::create([
            'store_id' => 1, // Dùng số 1 ảo
            'category_id' => $catThit->id,
            'name' => 'Thịt Ba Chỉ Heo',
            'original_price' => 95000,
            'price' => 125000,
            'discount_price' => 115000, 
            'stock' => 30,
            'description' => 'Thịt heo tươi nhập trong ngày.'
        ]);
    }
}