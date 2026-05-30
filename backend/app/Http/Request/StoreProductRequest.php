<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Cho phép tất cả người dùng thực hiện hành động này.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Quy tắc bắt lỗi dữ liệu khi thêm sản phẩm mới.
     */
    public function rules(): array
    {
        return [
            'store_id'          => 'required|integer',
            'category_id'       => 'required|exists:categories,id', // ID danh mục phải có thật trong DB
            'name'              => 'required|string|max:255',
            'original_price'    => 'required|numeric|min:0',
            'markup_percentage' => 'nullable|numeric|min:0|max:100',
            'markup_fixed'      => 'nullable|numeric|min:0',
            'price'             => 'required|numeric|min:0',
            'discount_price'    => 'nullable|numeric|min:0|lte:price', // Giá giảm phải nhỏ hơn hoặc bằng giá bán lẻ
            'stock'             => 'integer|min:0',
            'image_url'         => 'nullable|string',
            'description'       => 'nullable|string',
        ];
    }

    /**
     * Các câu thông báo lỗi bằng tiếng Việt cho Frontend dễ hiển thị.
     */
    public function messages(): array
    {
        return [
            'category_id.required'    => 'Vui lòng chọn danh mục cho sản phẩm.',
            'category_id.exists'      => 'Danh mục sản phẩm chọn không tồn tại.',
            'name.required'           => 'Tên sản phẩm không được bỏ trống.',
            'name.max'                => 'Tên sản phẩm không được dài quá 255 ký tự.',
            'original_price.required' => 'Giá gốc đối soát không được bỏ trống.',
            'original_price.min'      => 'Giá gốc không được nhỏ hơn 0đ.',
            'price.required'          => 'Giá bán lẻ không được bỏ trống.',
            'price.min'               => 'Giá bán lẻ không được nhỏ hơn 0đ.',
            'discount_price.lte'      => 'Giá khuyến mãi phải nhỏ hơn hoặc bằng giá bán lẻ.',
            'stock.integer'           => 'Số lượng kho phải là số nguyên.',
            'stock.min'               => 'Số lượng kho không được nhỏ hơn 0.',
        ];
    }
}