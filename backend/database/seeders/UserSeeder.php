<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'phone' => '0901234567',
                'address' => 'TP.HCM',
                'role' => 'admin',
            ],
            [
                'name' => 'Bach Hoa Xanh Thu Duc',
                'email' => 'bhx@example.com',
                'phone' => '0901111111',
                'address' => 'Thủ Đức, TP.HCM',
                'role' => 'partner',
            ],
            [
                'name' => 'WinMart Thu Duc',
                'email' => 'partner@example.com',
                'phone' => '0987654321',
                'address' => 'Thu Duc, TP.HCM',
                'role' => 'partner',
            ],
            [
                'name' => 'Nguyen Van A',
                'email' => 'customer@example.com',
                'phone' => '0912345678',
                'address' => 'Thu Duc, TP.HCM',
                'role' => 'customer',
            ],
            [
                'name' => 'Tran Thi B',
                'email' => 'customer2@example.com',
                'phone' => '0922222222',
                'address' => 'Quận 3, TP.HCM',
                'role' => 'customer',
            ],
            [
                'name' => 'Le Van C',
                'email' => 'customer3@example.com',
                'phone' => '0933333333',
                'address' => 'Thủ Đức, TP.HCM',
                'role' => 'customer',
            ],
            [
                'name' => 'Pham Thi D',
                'email' => 'customer4@example.com',
                'phone' => '0944444444',
                'address' => 'Bình Thạnh, TP.HCM',
                'role' => 'customer',
            ],
            [
                'name' => 'Hoang Van E',
                'email' => 'customer5@example.com',
                'phone' => '0955555555',
                'address' => 'Gò Vấp, TP.HCM',
                'role' => 'customer',
            ],
            [
                'name' => 'Nguyen Van F',
                'email' => 'customer6@example.com',
                'phone' => '0940842192',
                'address' => 'Thu Duc, TP.HCM',
                'role' => 'customer',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    ...$user,
                    'password' => Hash::make($user['role'] === 'admin' ? 'chotoicua12345@@' : '123456'),
                ]
            );
        }
    }
}
