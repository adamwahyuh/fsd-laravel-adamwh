<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ServerMetricsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'timestamp'      => 'required|date',
            'cpu_usage_pct'  => 'required|numeric',
            'ram_total_mb'   => 'required|numeric',
            'ram_used_mb'    => 'required|numeric',
            'ram_usage_pct'  => 'required|numeric',
            'disk_total_gb'  => 'required|numeric',
            'disk_used_gb'   => 'required|numeric',
            'disk_usage_pct' => 'required|numeric',
            'key' => 'required',
        ];
    }
}
