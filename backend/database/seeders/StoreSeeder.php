<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $fallbackPartnerId = User::where('role', 'partner')->value('id') ?? User::query()->value('id');
        $partnerIdsByEmail = User::where('role', 'partner')
            ->whereIn('email', array_filter([
                env('PARTNER_BHX_EMAIL'),
                env('PARTNER_WINMART_EMAIL'),
                env('PARTNER_GO_EMAIL'),
            ]))
            ->pluck('id', 'email');

        $stores = [
            [
                'id' => 1,
                'partner_id' => $partnerIdsByEmail->get(env('PARTNER_BHX_EMAIL'), $fallbackPartnerId),
                'name' => 'Bach Hoa Xanh Le Van Chi',
                'address' => 'Bach Hoa Xanh Le Van Chi, TP. Thu Duc',
                'logo_url' => 'logos/BHX.webp',
                'status' => 'active',
                'latitude' => 10.856496093453933,
                'longitude' => 106.77405206796195,
            ],
            [
                'id' => 2,
                'partner_id' => $partnerIdsByEmail->get(env('PARTNER_WINMART_EMAIL'), $fallbackPartnerId),
                'name' => 'WinMart Le Van Viet',
                'address' => 'WinMart Le Van Viet, TP. Thu Duc',
                'logo_url' => 'logos/Winmart.jpg',
                'status' => 'active',
                'latitude' => 10.845183433582347,
                'longitude' => 106.7785716799879,
            ],
            [
                'id' => 3,
                'partner_id' => $partnerIdsByEmail->get(env('PARTNER_GO_EMAIL'), $fallbackPartnerId),
                'name' => 'GO! Di An',
                'address' => 'GO! Di An, TP. Di An',
                'logo_url' => 'logos/GO.png',
                'status' => 'active',
                'latitude' => 10.889120952863461,
                'longitude' => 106.77583425300035,
            ],
        ];

        foreach ($stores as $store) {
            Store::withTrashed()->updateOrCreate(['id' => $store['id']], $store)->restore();
        }

        Store::whereNotIn('id', [1, 2, 3])->delete();
    }
}
