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
            $table->id(); // Khóa chính [cite: 34]
            
            // Khóa ngoại
            $table->foreignId('store_id'); // Tạm thời tắt nối khóa ngoại chờ code của Anh Thư // Liên kết tới bảng stores 
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); // Liên kết tới bảng categories [cite: 36, 122]
            
            // Chi tiết sản phẩm
            $table->string('name'); // Tên sản phẩm [cite: 37]
            $table->decimal('original_price', 12, 2); // Giá gốc đối soát [cite: 38]
            $table->decimal('markup_percentage', 5, 2)->nullable(); // % tăng giá [cite: 39]
            $table->decimal('markup_fixed', 12, 2)->nullable(); // Số tiền tăng giá cố định [cite: 40]
            $table->decimal('price', 12, 2); // Giá bán [cite: 41]
            $table->decimal('discount_price', 12, 2)->nullable(); // Giá giảm [cite: 42]
            $table->integer('stock')->default(0); // Số lượng tồn kho [cite: 43]
            $table->string('image_url')->nullable(); // Hình ảnh [cite: 44]
            $table->text('description')->nullable(); // Mô tả [cite: 45]
            $table->boolean('is_active')->default(true); // Trạng thái: true là đang bán, false là tắt bán
            
            $table->softDeletes(); // Xóa mềm [cite: 46]
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
