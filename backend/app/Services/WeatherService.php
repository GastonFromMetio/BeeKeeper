<?php

namespace App\Services;

use App\Models\Rucher;
use App\Models\WeatherReport;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class WeatherService
{
    public function fetchAndStore(Rucher $rucher): WeatherReport
    {
        if ($rucher->latitude === null || $rucher->longitude === null) {
            throw new RuntimeException('Les coordonnees du rucher sont manquantes.');
        }

        $response = Http::timeout(8)->get(config('services.open_meteo.forecast_url'), [
            'latitude' => $rucher->latitude,
            'longitude' => $rucher->longitude,
            'current' => 'temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m',
            'timezone' => 'auto',
        ]);

        if ($response->failed()) {
            throw new RuntimeException($response->json('reason') ?: 'Le service meteo est indisponible.');
        }

        $payload = $response->json();
        $current = $payload['current'] ?? [];
        $units = $payload['current_units'] ?? [];
        $fetchedAt = Carbon::parse($current['time'] ?? now());

        $report = $rucher->weatherReports()->create([
            'latitude' => $rucher->latitude,
            'longitude' => $rucher->longitude,
            'temperature' => $current['temperature_2m'] ?? null,
            'apparent_temperature' => $current['apparent_temperature'] ?? null,
            'wind_speed' => $current['wind_speed_10m'] ?? null,
            'humidity' => $current['relative_humidity_2m'] ?? null,
            'temperature_unit' => $units['temperature_2m'] ?? '°C',
            'apparent_temperature_unit' => $units['apparent_temperature'] ?? $units['temperature_2m'] ?? '°C',
            'wind_speed_unit' => $units['wind_speed_10m'] ?? 'km/h',
            'humidity_unit' => $units['relative_humidity_2m'] ?? '%',
            'source' => 'Open-Meteo',
            'fetched_at' => $fetchedAt,
            'raw_response' => $payload,
        ]);

        $rucher->update([
            'last_weather_checked_at' => $report->fetched_at,
            'last_weather_temperature' => $report->temperature,
            'last_weather_temperature_unit' => $report->temperature_unit,
        ]);

        return $report->refresh();
    }
}
