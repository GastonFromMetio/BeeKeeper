<?php

namespace App\Http\Requests\Rucher;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRucherRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'localisation' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'nb_emplacements' => ['required', 'integer', 'min:0'],
        ];
    }
}
