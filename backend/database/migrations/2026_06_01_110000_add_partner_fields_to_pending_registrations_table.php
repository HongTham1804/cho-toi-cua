<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pending_registrations', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('password_hash');
            $table->string('store_name')->nullable()->after('role');
            $table->string('store_address')->nullable()->after('store_name');
            $table->string('business_type')->nullable()->after('store_address');
        });
    }

    public function down(): void
    {
        Schema::table('pending_registrations', function (Blueprint $table) {
            $table->dropColumn(['role', 'store_name', 'store_address', 'business_type']);
        });
    }
};
