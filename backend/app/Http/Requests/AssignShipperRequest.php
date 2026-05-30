<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignShipperRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipper_id' => ['nullable', 'integer', 'exists:shippers,id'],
        ];
    }
}