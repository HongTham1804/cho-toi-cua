<?php

namespace Database\Seeders;

use App\Models\Shipper;
use Illuminate\Database\Seeder;

class ShipperSeeder extends Seeder
{
    public function run(): void
    {
        $shippers = [
            ['name' => 'Nguyễn Văn An', 'phone' => '0901000001', 'license_plate' => '59A1-123.45'],
            ['name' => 'Trần Minh Bình', 'phone' => '0901000002', 'license_plate' => '59B1-234.56'],
            ['name' => 'Lê Quốc Cường', 'phone' => '0901000003', 'license_plate' => '59C1-345.67'],
            ['name' => 'Phạm Hoàng Duy', 'phone' => '0901000004', 'license_plate' => '59D1-456.78'],
            ['name' => 'Hoàng Gia Huy', 'phone' => '0901000005', 'license_plate' => '59E1-567.89'],
            ['name' => 'Đặng Thanh Khoa', 'phone' => '0901000006', 'license_plate' => '60A1-111.22'],
            ['name' => 'Võ Nhật Long', 'phone' => '0901000007', 'license_plate' => '60B1-222.33'],
            ['name' => 'Bùi Đức Minh', 'phone' => '0901000008', 'license_plate' => '61A1-333.44'],
            ['name' => 'Mai Thành Nam', 'phone' => '0901000009', 'license_plate' => '61B1-444.55'],
            ['name' => 'Đỗ Anh Tú', 'phone' => '0901000010', 'license_plate' => '62A1-555.66'],
        ];

        foreach ($shippers as $shipper) {
            Shipper::firstOrCreate(
                ['phone' => $shipper['phone']],
                $shipper
            );
        }
    }
}