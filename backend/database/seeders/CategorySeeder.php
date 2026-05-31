<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Nông sản OCOP', 'slug' => Str::slug('Nông sản OCOP'), 'image_url' => 'https://example.com/ocop.jpg'],
            ['name' => 'Đồ khô & Ăn vặt', 'slug' => Str::slug('Đồ khô & Ăn vặt'), 'image_url' => 'https://example.com/snack.jpg'],
            ['name' => 'Thực phẩm chế biến', 'slug' => Str::slug('Thực phẩm chế biến'), 'image_url' => 'https://example.com/processed.jpg'],
            ['name' => 'Rau củ quả sạch', 'slug' => Str::slug('Rau củ quả sạch'), 'image_url' => 'https://example.com/veggie.jpg'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}