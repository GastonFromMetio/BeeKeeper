<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'BeeKeeper API',
    description: 'Documentation OpenAPI des endpoints backend BeeKeeper.'
)]
#[OA\Server(
    url: '/',
    description: 'Serveur courant'
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Bearer token',
    description: 'Token Laravel Sanctum a envoyer dans le header Authorization: Bearer {token}.'
)]
#[OA\Tag(
    name: 'Auth',
    description: 'Endpoints d authentification'
)]
#[OA\Tag(
    name: 'Ruchers',
    description: 'Gestion des ruchers utilisateurs'
)]
final class OpenApiSpec
{
}
