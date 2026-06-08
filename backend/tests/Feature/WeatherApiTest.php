<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WeatherApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_fetch_and_persist_weather_for_a_rucher(): void
    {
        Http::fake([
            '*' => Http::response([
                'current' => [
                    'time' => '2026-06-08T09:00',
                    'temperature_2m' => 16.2,
                    'apparent_temperature' => 15.1,
                    'wind_speed_10m' => 12.4,
                    'relative_humidity_2m' => 71,
                ],
                'current_units' => [
                    'temperature_2m' => '°C',
                    'apparent_temperature' => '°C',
                    'wind_speed_10m' => 'km/h',
                    'relative_humidity_2m' => '%',
                ],
            ]),
        ]);

        $user = User::factory()->create();
        $rucher = $user->ruchers()->create([
            'name' => 'Rucher météo',
            'latitude' => 50.9513,
            'longitude' => 1.8587,
            'nb_emplacements' => 12,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/ruchers/{$rucher->id}/weather");

        $response
            ->assertCreated()
            ->assertJsonPath('rucherId', $rucher->id)
            ->assertJsonPath('rucherName', 'Rucher météo')
            ->assertJsonPath('temperature', 16.2)
            ->assertJsonPath('apparentTemperature', 15.1)
            ->assertJsonPath('windSpeed', 12.4)
            ->assertJsonPath('humidity', 71);

        $this->assertDatabaseCount('weather_reports', 1);
        $this->assertDatabaseHas('weather_reports', [
            'rucher_id' => $rucher->id,
            'source' => 'Open-Meteo',
        ]);

        $freshRucher = $rucher->fresh();
        $this->assertNotNull($freshRucher->last_weather_checked_at);
        $this->assertSame(16.2, $freshRucher->last_weather_temperature);
        $this->assertSame('°C', $freshRucher->last_weather_temperature_unit);
    }

    public function test_user_can_read_weather_history_for_owned_rucher(): void
    {
        $user = User::factory()->create();
        $rucher = $user->ruchers()->create([
            'name' => 'Rucher historique',
            'latitude' => 50.9513,
            'longitude' => 1.8587,
            'nb_emplacements' => 12,
        ]);

        $rucher->weatherReports()->create([
            'latitude' => 50.9513,
            'longitude' => 1.8587,
            'temperature' => 18.4,
            'temperature_unit' => '°C',
            'apparent_temperature_unit' => '°C',
            'wind_speed_unit' => 'km/h',
            'humidity_unit' => '%',
            'source' => 'Open-Meteo',
            'fetched_at' => now(),
        ]);

        Sanctum::actingAs($user);

        $this->getJson("/api/ruchers/{$rucher->id}/weather")
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.rucherId', $rucher->id)
            ->assertJsonPath('0.temperature', 18.4);
    }

    public function test_user_cannot_fetch_weather_for_another_users_rucher(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $rucher = $owner->ruchers()->create([
            'name' => 'Rucher privé',
            'latitude' => 50.9513,
            'longitude' => 1.8587,
            'nb_emplacements' => 12,
        ]);

        Sanctum::actingAs($otherUser);

        $this->postJson("/api/ruchers/{$rucher->id}/weather")->assertForbidden();
        $this->getJson("/api/ruchers/{$rucher->id}/weather")->assertForbidden();
    }
}
