<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['rucher_id', 'name', 'statut', 'type_ruche', 'annee_reine', 'notes'])]
class Ruche extends Model
{
    public function rucher(): BelongsTo
    {
        return $this->belongsTo(Rucher::class);
    }
}