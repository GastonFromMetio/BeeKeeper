<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\User;
use App\Models\Ruche;
use App\Models\WeatherReport;

#[Fillable([
    'user_id',
    'name',
    'latitude',
    'longitude',
    'description',
    'nb_emplacements',
    'last_weather_checked_at',
    'last_weather_temperature',
    'last_weather_temperature_unit',
])]
class Rucher extends Model
{
    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'last_weather_checked_at' => 'datetime',
            'last_weather_temperature' => 'float',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ruches(): HasMany
    {
         return $this->hasMany(Ruche::class);
    }

    public function weatherReports(): HasMany
    {
        return $this->hasMany(WeatherReport::class);
    }

    public function latestWeatherReport(): HasOne
    {
        return $this->hasOne(WeatherReport::class)->latestOfMany('fetched_at');
    }
}
