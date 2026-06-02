<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_status', 50)->default('unpaid')->after('payment_method');
            $table->string('payment_reference')->nullable()->after('payment_status');
            $table->timestamp('paid_at')->nullable()->after('payment_reference');
            $table->timestamp('refunded_at')->nullable()->after('paid_at');

            $table->index(['payment_method', 'payment_status']);
            $table->index('payment_reference');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['payment_method', 'payment_status']);
            $table->dropIndex(['payment_reference']);
            $table->dropColumn(['payment_status', 'payment_reference', 'paid_at', 'refunded_at']);
        });
    }
};
