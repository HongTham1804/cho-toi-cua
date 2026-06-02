<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $partners = User::where('role', 'partner')->get()->values();
        $fallbackPartnerId = $partners->first()?->id ?? User::query()->value('id');

        $stores = [
            [
                'id' => 1,
                'partner_id' => $partners->get(0)?->id ?? $fallbackPartnerId,
                'name' => 'Bách Hóa Xanh Lê Văn Chí',
                'address' => 'Bách Hóa Xanh Lê Văn Chí, TP. Thủ Đức',
                'logo_url' => 'logos/BHX.webp',
                'status' => 'active',
                'latitude' => 10.856496093453933,
                'longitude' => 106.77405206796195,
            ],
            [
                'id' => 2,
                'partner_id' => $partners->get(1)?->id ?? $fallbackPartnerId,
                'name' => 'WinMart Lê Văn Việt',
                'address' => 'WinMart Lê Văn Việt, TP. Thủ Đức',
                'logo_url' => 'logos/Winmart.jpg',
                'status' => 'active',
                'latitude' => 10.845183433582347,
                'longitude' => 106.7785716799879,
            ],
            [
                'id' => 3,
                'partner_id' => $partners->get(2)?->id ?? $fallbackPartnerId,
                'name' => 'GO! Dĩ An',
                'address' => 'GO! Dĩ An, TP. Dĩ An',
                'logo_url' => 'logos/GO.png',
                'status' => 'active',
                'latitude' => 10.889120952863461,
                'longitude' => 106.77583425300035,
            ],
        ];

        foreach ($stores as $store) {
            Store::updateOrCreate(['id' => $store['id']], $store);
        }

        Store::whereNotIn('id', [1, 2, 3])->update(['status' => 'inactive']);
    }
}
