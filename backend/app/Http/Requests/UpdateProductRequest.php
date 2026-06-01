<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'store_id' => ['sometimes', 'required', 'integer', 'min:1'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'original_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'markup_percentage' => ['nullable', 'numeric', 'min:0'],
            'markup_fixed' => ['nullable', 'numeric', 'min:0'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:100'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
