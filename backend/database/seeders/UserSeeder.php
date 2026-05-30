<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0901234567',
            'address' => 'TP.HCM',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Bach Hoa Xanh Thu Duc',
            'email' => 'bhx@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0901111111',
            'address' => 'Thủ Đức, TP.HCM',
            'role' => 'partner',
        ]);

        User::create([
            'name' => 'WinMart Thu Duc',
            'email' => 'partner@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0987654321',
            'address' => 'Thu Duc, TP.HCM',
            'role' => 'partner',
        ]);

        User::create([
            'name' => 'Nguyen Van A',
            'email' => 'customer@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0912345678',
            'address' => 'Thu Duc, TP.HCM',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'Tran Thi B',
            'email' => 'customer2@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0922222222',
            'address' => 'Quận 3, TP.HCM',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'Le Van C',
            'email' => 'customer3@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0933333333',
            'address' => 'Thủ Đức, TP.HCM',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'Pham Thi D',
            'email' => 'customer4@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0944444444',
            'address' => 'Bình Thạnh, TP.HCM',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'Hoang Van E',
            'email' => 'customer5@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0955555555',
            'address' => 'Gò Vấp, TP.HCM',
            'role' => 'customer',
        ]);

        User::create([
            'name' => 'Nguyen Van F',
            'email' => 'customer6@example.com',
            'password' => Hash::make('123456'),
            'phone' => '0940842192',
            'address' => 'Thu Duc, TP.HCM',
            'role' => 'customer',
        ]);

    }
}