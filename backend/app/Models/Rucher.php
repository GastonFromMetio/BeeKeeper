<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
// use App\Models\Ruche;

#[Fillable(['user_id', 'name', 'localisation', 'description', 'nb_emplacements'])]
class Rucher extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function ruches(): HasMany
    // {
    //     return $this->hasMany(Ruche::class);
    // }
}
