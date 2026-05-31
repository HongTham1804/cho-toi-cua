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
    Schema::create('products', function (Blueprint $table) {
        $table->id(); // [cite: 34]
        $table->foreignId('store_id')->constrained(); // [cite: 35]
        $table->foreignId('category_id')->constrained(); // [cite: 36]
        $table->string('name'); // [cite: 37]
        $table->decimal('original_price', 12, 2); // [cite: 38]
        $table->decimal('price', 12, 2); // [cite: 41]
        $table->integer('stock'); // [cite: 43]
        $table->string('image_url')->nullable(); // [cite: 44]
        $table->text('description')->nullable(); // [cite: 45]
        $table->softDeletes(); // [cite: 46] - Xóa mềm
        $table->timestamps(); // [cite: 47]
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
