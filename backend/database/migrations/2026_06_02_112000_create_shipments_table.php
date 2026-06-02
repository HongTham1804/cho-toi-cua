<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained('orders')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('shipper_id')->nullable()->constrained('shippers')->nullOnDelete();
            $table->string('status', 50)->default('assigned');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->decimal('current_latitude', 15, 12)->nullable();
            $table->decimal('current_longitude', 15, 12)->nullable();
            $table->decimal('origin_latitude', 15, 12)->nullable();
            $table->decimal('origin_longitude', 15, 12)->nullable();
            $table->decimal('destination_latitude', 15, 12)->nullable();
            $table->decimal('destination_longitude', 15, 12)->nullable();
            $table->string('route_summary')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->index(['shipper_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
