<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')
            ->select('id', 'name')
            ->whereNull('unit')
            ->orWhere('unit', '')
            ->orderBy('id')
            ->get()
            ->each(function (object $product): void {
                DB::table('products')
                    ->where('id', $product->id)
                    ->update(['unit' => $this->productUnit($product->name)]);
            });
    }

    public function down(): void
    {
    }

    private function productUnit(string $name): string
    {
        if (preg_match('/lốc\s+\d+\s+(lon|hộp)/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/(túi|hộp|chai|gói|bó)\s+[\d.]+\s?(kg|g|l|ml)/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/\d+\s+(gói|lon|hộp|cái)/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/hộp\s+\d+\s+cái/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/[\d.]+\s?(kg|g|l|ml)/iu', $name, $matches)) {
            return $matches[0];
        }

        return '1 sản phẩm';
    }
};
