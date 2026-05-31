<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('store_id'); // Tạm thời bỏ constraint chờ bảng stores
            $table->unsignedBigInteger('shipper_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('voucher_id')->nullable(); // Tạm thời bỏ constraint chờ bảng vouchers
            $table->decimal('shipping_fee', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->text('shipping_address');
            $table->string('payment_method', 50);
            $table->string('status', 50)->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
