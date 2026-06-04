<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $fixedPartners = [
            [
                'name' => 'Bách Hóa Xanh Lê Văn Chí',
                'email' => env('PARTNER_BHX_EMAIL'),
                'password' => env('PARTNER_BHX_PASSWORD'),
                'phone' => '0901111111',
                'address' => 'Thu Duc, TP.HCM',
            ],
            [
                'name' => 'WinMart Lê Văn Việt',
                'email' => env('PARTNER_WINMART_EMAIL'),
                'password' => env('PARTNER_WINMART_PASSWORD'),
                'phone' => '0987654321',
                'address' => 'Thu Duc, TP.HCM',
            ],
            [
                'name' => 'GO! Dĩ An',
                'email' => env('PARTNER_GO_EMAIL'),
                'password' => env('PARTNER_GO_PASSWORD'),
                'phone' => '0903333333',
                'address' => 'Dĩ An, Bình Dương',
            ],
        ];

        foreach ($fixedPartners as $partner) {
            if (blank($partner['email']) || blank($partner['password'])) {
                continue;
            }

            User::updateOrCreate(
                ['email' => $partner['email']],
                [
                    'name' => $partner['name'],
                    'phone' => $partner['phone'],
                    'address' => $partner['address'],
                    'role' => 'partner',
                    'password' => Hash::make($partner['password']),
                ]
            );
        }

        $fixedPartnerEmails = array_values(array_filter(array_column($fixedPartners, 'email')));
        if ($fixedPartnerEmails !== []) {
            User::where('role', 'partner')
                ->whereNotIn('email', $fixedPartnerEmails)
                ->delete();
        }

        $adminPassword = env('ADMIN_PASSWORD');
        $users = [];

        if (! blank($adminPassword)) {
            $users[] = [
                'name' => env('ADMIN_NAME', 'Admin'),
                'email' => env('ADMIN_EMAIL', 'admin@example.com'),
                'phone' => env('ADMIN_PHONE', '0901234567'),
                'address' => 'TP.HCM',
                'role' => 'admin',
                'password' => $adminPassword,
            ];
        }

        $users = [
            ...$users,
            [
                'name' => 'Nguyễn Văn A',
                'email' => 'customer@example.com',
                'phone' => '0912345678',
                'address' => 'Thu Duc, TP.HCM',
                'role' => 'customer',
                'password' => '123456',
            ],
            [
                'name' => 'Trần Thị B',
                'email' => 'customer2@example.com',
                'phone' => '0922222222',
                'address' => 'Quan 3, TP.HCM',
                'role' => 'customer',
                'password' => '123456',
            ],
            [
                'name' => 'Lê Văn C',
                'email' => 'customer3@example.com',
                'phone' => '0933333333',
                'address' => 'Thu Duc, TP.HCM',
                'role' => 'customer',
                'password' => '123456',
            ],
            [
                'name' => 'Phạm Thị D',
                'email' => 'customer4@example.com',
                'phone' => '0944444444',
                'address' => 'Bình Thạnh, TP.HCM',
                'role' => 'customer',
                'password' => '123456',
            ],
            [
                'name' => 'Hoàng Văn E',
                'email' => 'customer5@example.com',
                'phone' => '0955555555',
                'address' => 'Gò Vấp, TP.HCM',
                'role' => 'customer',
                'password' => '123456',
            ],
            [
                'name' => 'Nguyễn Văn F',
                'email' => 'customer6@example.com',
                'phone' => '0940842192',
                'address' => 'Thu Duc, TP.HCM',
                'role' => 'customer',
                'password' => '123456',
            ],
        ];

        foreach ($users as $user) {
            if (blank($user['email']) || blank($user['password'])) {
                continue;
            }

            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'phone' => $user['phone'],
                    'address' => $user['address'],
                    'role' => $user['role'],
                    'password' => Hash::make($user['password']),
                ]
            );
        }
    }
}
