<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rucher;
use App\Models\WeatherReport;
use App\Services\WeatherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class WeatherController extends Controller
{
    public function index(Request $request, Rucher $rucher): JsonResponse
    {
        abort_if($rucher->user_id !== $request->user()->id, 403);

        $reports = $rucher->weatherReports()
            ->latest('fetched_at')
            ->limit(20)
            ->get()
            ->map(fn (WeatherReport $report) => $this->formatReport($rucher, $report));

        return response()->json($reports);
    }

    public function store(Request $request, Rucher $rucher, WeatherService $weatherService): JsonResponse
    {
        abort_if($rucher->user_id !== $request->user()->id, 403);

        try {
            $report = $weatherService->fetchAndStore($rucher);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json($this->formatReport($rucher->refresh(), $report), 201);
    }

    private function formatReport(Rucher $rucher, WeatherReport $report): array
    {
        return [
            'id' => $report->id,
            'rucherId' => $rucher->id,
            'rucherName' => $rucher->name,
            'latitude' => $report->latitude,
            'longitude' => $report->longitude,
            'temperature' => $report->temperature,
            'apparentTemperature' => $report->apparent_temperature,
            'windSpeed' => $report->wind_speed,
            'humidity' => $report->humidity,
            'temperatureUnit' => $report->temperature_unit,
            'apparentTemperatureUnit' => $report->apparent_temperature_unit,
            'windSpeedUnit' => $report->wind_speed_unit,
            'humidityUnit' => $report->humidity_unit,
            'source' => $report->source,
            'fetchedAt' => $report->fetched_at?->toISOString(),
        ];
    }
}
