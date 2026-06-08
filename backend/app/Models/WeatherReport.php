<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'rucher_id',
    'latitude',
    'longitude',
    'temperature',
    'apparent_temperature',
    'wind_speed',
    'humidity',
    'temperature_unit',
    'apparent_temperature_unit',
    'wind_speed_unit',
    'humidity_unit',
    'source',
    'fetched_at',
    'raw_response',
])]
class WeatherReport extends Model
{
    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'temperature' => 'float',
            'apparent_temperature' => 'float',
            'wind_speed' => 'float',
            'humidity' => 'float',
            'fetched_at' => 'datetime',
            'raw_response' => 'array',
        ];
    }

    public function rucher(): BelongsTo
    {
        return $this->belongsTo(Rucher::class);
    }
}
