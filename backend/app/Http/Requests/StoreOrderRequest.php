<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
public function rules(): array
{
    return [
        'customer_id' => ['required', 'exists:users,id'],
        'store_id' => ['required', 'integer', 'min:1'],
        'voucher_id' => ['nullable', 'integer', 'min:1'],
        'shipping_address' => ['required', 'string', 'max:500'],
        'payment_method' => ['required', 'string', 'in:cod,bank_transfer,momo'],

        'items' => ['required', 'array', 'min:1'],
        'items.*.product_id' => ['required', 'integer', 'min:1'],
        'items.*.quantity' => ['required', 'integer', 'min:1'],
        'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        'items.*.original_price' => ['nullable', 'numeric', 'min:0'],
        'items.*.is_flash_sale' => ['nullable', 'boolean'],
        'shipping_fee' => ['nullable', 'numeric', 'min:0'],
    ];
}

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Vui lòng chọn khách hàng.',
            'customer_id.exists' => 'Khách hàng không tồn tại.',

            'store_id.required' => 'Vui lòng chọn siêu thị.',
            'store_id.integer' => 'Siêu thị không hợp lệ.',
            'store_id.min' => 'Siêu thị không hợp lệ.',
            'store_id.exists' => 'Siêu thị không tồn tại.',

            'voucher_id.integer' => 'Mã giảm giá không hợp lệ.',
            'voucher_id.min' => 'Mã giảm giá không hợp lệ.',
            'voucher_id.exists' => 'Mã giảm giá không tồn tại.',

            'shipping_address.required' => 'Vui lòng nhập địa chỉ giao hàng.',
            'shipping_address.max' => 'Địa chỉ giao hàng không được quá 500 ký tự.',

            'payment_method.required' => 'Vui lòng chọn phương thức thanh toán.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',

            'items.required' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'items.array' => 'Danh sách sản phẩm không hợp lệ.',
            'items.min' => 'Đơn hàng phải có ít nhất một sản phẩm.',

            'items.*.product_id.required' => 'Vui lòng chọn sản phẩm.',
            'items.*.product_id.integer' => 'Sản phẩm không hợp lệ.',
            'items.*.product_id.min' => 'Sản phẩm không hợp lệ.',
            'items.*.product_id.exists' => 'Sản phẩm không tồn tại.',

            'items.*.quantity.required' => 'Vui lòng nhập số lượng sản phẩm.',
            'items.*.quantity.integer' => 'Số lượng sản phẩm phải là số nguyên.',
            'items.*.quantity.min' => 'Số lượng sản phẩm phải lớn hơn 0.',
        ];
    }
}
