<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id('ReviewID');
            $table->unsignedBigInteger('CustomerID'); 
            $table->unsignedBigInteger('ProductID');
            $table->integer('RatingValue'); // Giá trị từ 1-5
            $table->text('Comment')->nullable();
            $table->timestamps(); // Đã bao gồm CreatedAt

            // Khóa ngoại
            $table->foreign('CustomerID')->references('UserID')->on('users')->onDelete('cascade');
            $table->foreign('ProductID')->references('ProductID')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
};