<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->text('delivery_address')->nullable()->after('shipping_address');
            $table->decimal('delivery_latitude', 15, 12)->nullable()->after('delivery_address');
            $table->decimal('delivery_longitude', 15, 12)->nullable()->after('delivery_latitude');
        });

        DB::table('orders')
            ->whereNull('delivery_address')
            ->update([
                'delivery_address' => DB::raw('shipping_address'),
            ]);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['delivery_address', 'delivery_latitude', 'delivery_longitude']);
        });
    }
};
