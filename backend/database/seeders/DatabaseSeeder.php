<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            StoreSeeder::class,
            ShipperSeeder::class,
            CategorySeeder::class,
            ProductCatalogSeeder::class,
            PromotionSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
