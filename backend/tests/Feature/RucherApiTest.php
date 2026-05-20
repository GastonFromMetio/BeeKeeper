<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RucherApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_a_rucher_with_coordinates(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/ruchers', [
            'name' => 'Rucher des Tilleuls',
            'localisation' => 'Lyon',
            'latitude' => 45.764043,
            'longitude' => 4.835659,
            'description' => 'Rucher principal',
            'nb_emplacements' => 12,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.name', 'Rucher des Tilleuls')
            ->assertJsonPath('data.latitude', 45.764043)
            ->assertJsonPath('data.longitude', 4.835659);

        $this->assertDatabaseHas('ruchers', [
            'user_id' => $user->id,
            'name' => 'Rucher des Tilleuls',
            'localisation' => 'Lyon',
            'latitude' => 45.764043,
            'longitude' => 4.835659,
            'nb_emplacements' => 12,
        ]);
    }

    public function test_rucher_coordinates_are_required_when_creating(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/ruchers', [
            'name' => 'Rucher incomplet',
            'localisation' => 'Lyon',
            'nb_emplacements' => 12,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['latitude', 'longitude']);
    }
}
