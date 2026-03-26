<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_a_sanctum_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Alice Martin',
            'email' => 'alice@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'name', 'email'],
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'alice@example.com',
        ]);
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_user_can_login_access_me_and_logout_with_bearer_token(): void
    {
        User::factory()->create([
            'name' => 'Alice Martin',
            'email' => 'alice@example.com',
            'password' => 'password123',
        ]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'alice@example.com',
            'password' => 'password123',
        ]);

        $token = $loginResponse->json('token');

        $loginResponse
            ->assertOk()
            ->assertJsonPath('user.email', 'alice@example.com');

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('email', 'alice@example.com');

        $this->withToken($token)
            ->deleteJson('/api/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Deconnexion reussie');

        $this->assertDatabaseCount('personal_access_tokens', 0);

        app('auth')->forgetGuards();

        $this->withToken($token)
            ->getJson('/api/auth/me')
            ->assertUnauthorized();
    }

    public function test_protected_auth_route_requires_token(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }
}
