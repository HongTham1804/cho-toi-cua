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
            [
                'name' => 'Sữa các loại',
                'slug' => Str::slug('Sữa các loại'),
                'image_url' => 'https://loremflickr.com/400/400/milk?lock=201',
            ],
            [
                'name' => 'Rau - Củ - Trái Cây',
                'slug' => Str::slug('Rau - Củ - Trái Cây'),
                'image_url' => 'https://loremflickr.com/400/400/vegetables,fruit?lock=202',
            ],
            [
                'name' => 'Hóa Phẩm - Tẩy rửa',
                'slug' => Str::slug('Hóa Phẩm - Tẩy rửa'),
                'image_url' => 'https://loremflickr.com/400/400/cleaning,detergent?lock=203',
            ],
            [
                'name' => 'Chăm Sóc Cá Nhân',
                'slug' => Str::slug('Chăm Sóc Cá Nhân'),
                'image_url' => 'https://loremflickr.com/400/400/shampoo,toothpaste?lock=204',
            ],
            [
                'name' => 'Thịt - Hải Sản Tươi',
                'slug' => Str::slug('Thịt - Hải Sản Tươi'),
                'image_url' => 'https://loremflickr.com/400/400/meat,seafood?lock=205',
            ],
            [
                'name' => 'Bánh Kẹo',
                'slug' => Str::slug('Bánh Kẹo'),
                'image_url' => 'https://loremflickr.com/400/400/candy,cookies?lock=206',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}