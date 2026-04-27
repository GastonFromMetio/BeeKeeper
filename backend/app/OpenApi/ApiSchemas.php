<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'User',
    required: ['id', 'name', 'email'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Alice Martin'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'alice@example.com'),
        new OA\Property(property: 'email_verified_at', type: 'string', format: 'date-time', nullable: true, example: null),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', nullable: true),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Rucher',
    required: ['id', 'user_id', 'name', 'localisation', 'nb_emplacements'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'user_id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Rucher des Tilleuls'),
        new OA\Property(property: 'localisation', type: 'string', example: 'Lyon'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Rucher principal'),
        new OA\Property(property: 'nb_emplacements', type: 'integer', minimum: 0, example: 12),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', nullable: true),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Ruche',
    required: ['id', 'rucher_id', 'name', 'statut', 'type_ruche'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'rucher_id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Ruche 01'),
        new OA\Property(property: 'statut', type: 'string', example: 'active'),
        new OA\Property(property: 'type_ruche', type: 'string', example: 'Dadant'),
        new OA\Property(property: 'annee_reine', type: 'integer', nullable: true, example: 2024),
        new OA\Property(property: 'notes', type: 'string', nullable: true, example: 'Colonie tres dynamique'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'rucher', ref: '#/components/schemas/Rucher', nullable: true),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'RegisterRequest',
    required: ['name', 'email', 'password', 'password_confirmation'],
    properties: [
        new OA\Property(property: 'name', type: 'string', example: 'Alice Martin'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'alice@example.com'),
        new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
        new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'password123'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'LoginRequest',
    required: ['email', 'password'],
    properties: [
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'alice@example.com'),
        new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'StoreRucherRequest',
    required: ['name', 'localisation', 'nb_emplacements'],
    properties: [
        new OA\Property(property: 'name', type: 'string', example: 'Rucher des Tilleuls'),
        new OA\Property(property: 'localisation', type: 'string', example: 'Lyon'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Rucher principal'),
        new OA\Property(property: 'nb_emplacements', type: 'integer', minimum: 0, example: 12),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'UpdateRucherRequest',
    required: ['name', 'localisation', 'nb_emplacements'],
    properties: [
        new OA\Property(property: 'name', type: 'string', example: 'Rucher du Verger'),
        new OA\Property(property: 'localisation', type: 'string', example: 'Grenoble'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Mise a jour du rucher'),
        new OA\Property(property: 'nb_emplacements', type: 'integer', minimum: 0, example: 16),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'StoreRucheRequest',
    required: ['rucher_id', 'name', 'statut', 'type_ruche'],
    properties: [
        new OA\Property(property: 'rucher_id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Ruche 01'),
        new OA\Property(property: 'statut', type: 'string', example: 'active'),
        new OA\Property(property: 'type_ruche', type: 'string', example: 'Dadant'),
        new OA\Property(property: 'annee_reine', type: 'integer', nullable: true, example: 2024),
        new OA\Property(property: 'notes', type: 'string', nullable: true, example: 'Colonie tres dynamique'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'UpdateRucheRequest',
    properties: [
        new OA\Property(property: 'rucher_id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Ruche 02'),
        new OA\Property(property: 'statut', type: 'string', example: 'en observation'),
        new OA\Property(property: 'type_ruche', type: 'string', example: 'Langstroth'),
        new OA\Property(property: 'annee_reine', type: 'integer', nullable: true, example: 2025),
        new OA\Property(property: 'notes', type: 'string', nullable: true, example: 'Division recente'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'AuthResponse',
    required: ['message', 'user', 'token'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Connexion reussie'),
        new OA\Property(property: 'user', ref: '#/components/schemas/User'),
        new OA\Property(property: 'token', type: 'string', example: '1|aVeryLongSanctumToken'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'RucherWriteResponse',
    required: ['message', 'data'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Rucher cree'),
        new OA\Property(property: 'data', ref: '#/components/schemas/Rucher'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'RucheWriteResponse',
    required: ['message', 'data'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Ruche creee'),
        new OA\Property(property: 'data', ref: '#/components/schemas/Ruche'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'MessageResponse',
    required: ['message'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Operation effectuee'),
    ],
    type: 'object'
)]
final class ApiSchemas
{
}
