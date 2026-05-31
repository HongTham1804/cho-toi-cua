<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        // Thêm Bách Hóa Xanh (partner_id = 2 theo như UserSeeder)
        DB::table('stores')->insert([
            'partner_id' => 2,
            'name' => 'Bách Hóa Xanh Thủ Đức',
            'address' => 'Bình Thạnh, TP.HCM',
            'logo_url' => null,
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Thêm WinMart (partner_id = 3 theo như UserSeeder)
        DB::table('stores')->insert([
            'partner_id' => 3,
            'name' => 'Bách Hóa Xanh Thủ Đức',
            'address' => 'Thủ Đức, TP.HCM',
            'logo_url' => 'logos/BHX.webp',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('stores')->insert([
            'partner_id' => 4,
            'name' => 'WinMart Bình Dương',
            'address' => 'Bình Dương, TP.HCM',
            'logo_url' => 'logos/Winmart.jpg',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('stores')->insert([
            'partner_id' => 5,
            'name' => 'Bách Hóa Xanh Thủ Đức',
            'address' => 'Thủ Đức, TP.HCM',
            'logo_url' => 'logos/BHX.webp',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('stores')->insert([
            'partner_id' => 6,
            'name' => 'WinMart Bình Tân',
            'address' => 'Bình Tân, TP.HCM',
            'logo_url' => 'logos/Winmart.jpg',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }
}
