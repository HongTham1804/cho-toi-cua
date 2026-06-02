<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->decimal('latitude', 15, 12)->nullable()->after('status');
            $table->decimal('longitude', 15, 12)->nullable()->after('latitude');
        });

        DB::table('stores')->where('id', 1)->update([
            'latitude' => 10.856496093453933,
            'longitude' => 106.77405206796195,
        ]);

        DB::table('stores')->where('id', 2)->update([
            'latitude' => 10.845183433582347,
            'longitude' => 106.7785716799879,
        ]);

        DB::table('stores')->where('id', 3)->update([
            'latitude' => 10.889120952863461,
            'longitude' => 106.77583425300035,
        ]);
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
