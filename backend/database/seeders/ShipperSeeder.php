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
            ['name' => 'Ngô Khánh Toàn', 'phone' => '0901000011', 'license_plate' => '63A1-101.20'],
            ['name' => 'Trịnh Bảo Nam', 'phone' => '0901000012', 'license_plate' => '64B1-202.30'],
            ['name' => 'Huỳnh Tấn Phát', 'phone' => '0901000013', 'license_plate' => '65C1-303.40'],
            ['name' => 'Phan Minh Quân', 'phone' => '0901000014', 'license_plate' => '66D1-404.50'],
            ['name' => 'Vũ Hoàng Long', 'phone' => '0901000015', 'license_plate' => '67E1-505.60'],
            ['name' => 'Đinh Gia Bảo', 'phone' => '0901000016', 'license_plate' => '68F1-606.70'],
            ['name' => 'Cao Minh Tâm', 'phone' => '0901000017', 'license_plate' => '69G1-707.80'],
            ['name' => 'Lý Anh Kiệt', 'phone' => '0901000018', 'license_plate' => '70H1-808.90'],
            ['name' => 'Tạ Quang Hưng', 'phone' => '0901000019', 'license_plate' => '71K1-909.10'],
            ['name' => 'Dương Thành Đạt', 'phone' => '0901000020', 'license_plate' => '72L1-010.11'],
        ];

        Shipper::query()->delete();

        foreach ($shippers as $shipper) {
            Shipper::create($shipper);
        }
    }
}
