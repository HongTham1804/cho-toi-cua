<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id('StoreID');
            $table->string('StoreName');
            $table->string('Address');
            $table->string('OperatingHours')->nullable();
            $table->decimal('Rating', 3, 2)->default(0.00); // Ví dụ: 4.50
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('stores');
    }
};