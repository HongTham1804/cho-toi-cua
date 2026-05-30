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
        Schema::create('users', function (Blueprint $table) {
    $table->id(); // [cite: 4]
    $table->string('name'); // [cite: 5]
    $table->string('email')->unique(); // [cite: 6]
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password'); // [cite: 7]

    // THÊM 3 DÒNG NÀY VÀO ĐÂY:
    $table->string('phone')->nullable(); // [cite: 8]
    $table->string('address')->nullable(); // [cite: 9]
    $table->string('role')->default('customer'); // [cite: 10]

    $table->rememberToken();
    $table->timestamps(); // [cite: 11]
});

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
