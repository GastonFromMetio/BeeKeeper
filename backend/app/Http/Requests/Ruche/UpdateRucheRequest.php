<?php

namespace App\Http\Requests\Ruche;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRucheRequest extends FormRequest
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
            'rucher_id' => ['sometimes', 'required', 'exists:ruchers,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'statut' => ['sometimes', 'required', 'string', 'max:255'],
            'type_ruche' => ['sometimes', 'required', 'string', 'max:255'],
            'annee_reine' => ['nullable', 'integer', 'min:2000'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
