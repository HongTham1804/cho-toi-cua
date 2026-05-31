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
    Schema::create('categories', function (Blueprint $table) {
        $table->id(); // [cite: 28]
        $table->string('name'); // [cite: 29]
        $table->string('slug'); // [cite: 30]
        $table->string('image_url')->nullable(); // [cite: 31]
        $table->timestamps(); // [cite: 32]
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
