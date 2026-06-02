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
        'store_id' => ['required', 'exists:stores,id'],
        'voucher_id' => ['nullable', 'exists:vouchers,id'],
        'shipping_voucher_id' => ['nullable', 'exists:vouchers,id'],
        'shipping_address' => ['required', 'string', 'max:500'],
        'delivery_address' => ['nullable', 'string', 'max:500'],
        'delivery_latitude' => ['nullable', 'numeric', 'between:-90,90'],
        'delivery_longitude' => ['nullable', 'numeric', 'between:-180,180'],
        'payment_method' => ['required', 'string', 'in:cod,payos,bank_transfer,wallet'],
        'note' => ['nullable', 'string', 'max:1000'],

        'items' => ['required', 'array', 'min:1'],
        'items.*.product_id' => ['required', 'exists:products,id'],
        'items.*.quantity' => ['required', 'integer', 'min:1'],
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
            'store_id.exists' => 'Siêu thị không tồn tại.',

            'voucher_id.integer' => 'Mã giảm giá không hợp lệ.',

            'shipping_address.required' => 'Vui lòng nhập địa chỉ giao hàng.',
            'shipping_address.max' => 'Địa chỉ giao hàng không được quá 500 ký tự.',

            'payment_method.required' => 'Vui lòng chọn phương thức thanh toán.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',

            'items.required' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'items.array' => 'Danh sách sản phẩm không hợp lệ.',
            'items.min' => 'Đơn hàng phải có ít nhất một sản phẩm.',

            'items.*.product_id.required' => 'Vui lòng chọn sản phẩm.',
            'items.*.product_id.exists' => 'Sản phẩm không tồn tại.',

            'items.*.quantity.required' => 'Vui lòng nhập số lượng sản phẩm.',
            'items.*.quantity.integer' => 'Số lượng sản phẩm phải là số nguyên.',
            'items.*.quantity.min' => 'Số lượng sản phẩm phải lớn hơn 0.',
        ];
    }
}
