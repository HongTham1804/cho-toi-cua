<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Xác thực người dùng có quyền thực hiện hành động này không.
     */
    public function authorize(): bool
    {
        // Chuyển thành true để cho phép tất cả mọi người thực hiện (hoặc chỉnh lại theo phân quyền sau)
        return true; 
    }

    /**
     * Định nghĩa các quy tắc validate dữ liệu.
     */
    public function rules(): array
    {
        return [
            'store_id'          => 'sometimes|required|integer',
            'category_id'       => 'sometimes|required|exists:categories,id', // Phải tồn tại ID trong bảng categories
            'name'              => 'sometimes|required|string|max:255',
            'original_price'    => 'sometimes|required|numeric|min:0',
            'markup_percentage' => 'nullable|numeric|min:0|max:100',
            'markup_fixed'      => 'nullable|numeric|min:0',
            'price'             => 'sometimes|required|numeric|min:0',
            'discount_price'    => 'nullable|numeric|min:0|lte:price', // Giá giảm phải nhỏ hơn hoặc bằng giá bán lẻ
            'stock'             => 'sometimes|required|integer|min:0',
            'image_url'         => 'nullable|string',
            'description'       => 'nullable|string',
            'is_active'         => 'sometimes|required|boolean', // Trạng thái bật/tắt bán (true/false)
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi bằng tiếng Việt.
     */
    public function messages(): array
    {
        return [
            'category_id.exists'      => 'Danh mục sản phẩm không tồn tại trên hệ thống.',
            'name.required'           => 'Tên sản phẩm không được để trống.',
            'name.max'                => 'Tên sản phẩm không được vượt quá 255 ký tự.',
            'original_price.required' => 'Giá gốc đối soát không được để trống.',
            'original_price.numeric'  => 'Giá gốc phải là một số hợp lệ.',
            'original_price.min'      => 'Giá gốc không được nhỏ hơn 0đ.',
            'price.required'          => 'Giá bán lẻ không được để trống.',
            'price.numeric'           => 'Giá bán lẻ phải là một số hợp lệ.',
            'price.min'               => 'Giá bán lẻ không được nhỏ hơn 0đ.',
            'discount_price.numeric'  => 'Giá khuyến mãi phải là một số hợp lệ.',
            'discount_price.min'      => 'Giá khuyến mãi không được nhỏ hơn 0đ.',
            'discount_price.lte'      => 'Giá khuyến mãi phải nhỏ hơn hoặc bằng giá bán lẻ.',
            'stock.required'          => 'Số lượng tồn kho không được để trống.',
            'stock.integer'           => 'Số lượng tồn kho phải là số nguyên tròn.',
            'stock.min'               => 'Số lượng tồn kho không được nhỏ hơn 0.',
            'is_active.boolean'       => 'Trạng thái hoạt động phải là đúng (true) hoặc sai (false).',
        ];
    }
}