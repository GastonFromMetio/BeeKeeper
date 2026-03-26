<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rucher\StoreRucherRequest;
use App\Http\Requests\Rucher\UpdateRucherRequest;
use App\Models\Rucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class RucherController extends Controller
{
    #[OA\Get(
        path: '/api/ruchers',
        operationId: 'listRuchers',
        summary: 'Lister les ruchers de l utilisateur connecte',
        security: [['sanctum' => []]],
        tags: ['Ruchers'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des ruchers',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/Rucher')
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $ruchers = Rucher::where('user_id', $request->user()->id)->get();

        return response()->json($ruchers);
    }

    #[OA\Post(
        path: '/api/ruchers',
        operationId: 'storeRucher',
        summary: 'Creer un rucher',
        security: [['sanctum' => []]],
        tags: ['Ruchers'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/StoreRucherRequest')
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Rucher cree',
                content: new OA\JsonContent(ref: '#/components/schemas/RucherWriteResponse')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 422, description: 'Erreur de validation'),
        ]
    )]
    public function store(StoreRucherRequest $request): JsonResponse
    {
        $rucher = $request->user()->ruchers()->create($request->validated());

        return response()->json([
            'message' => 'Rucher cree',
            'data' => $rucher,
        ], 201);
    }

    #[OA\Get(
        path: '/api/ruchers/{rucher}',
        operationId: 'showRucher',
        summary: 'Afficher un rucher',
        security: [['sanctum' => []]],
        tags: ['Ruchers'],
        parameters: [
            new OA\Parameter(
                name: 'rucher',
                description: 'ID du rucher',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Rucher trouve',
                content: new OA\JsonContent(ref: '#/components/schemas/Rucher')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 403, description: 'Acces refuse'),
            new OA\Response(response: 404, description: 'Rucher introuvable'),
        ]
    )]
    public function show(Request $request, Rucher $rucher): JsonResponse
    {
        abort_if($rucher->user_id !== $request->user()->id, 403);

        return response()->json($rucher);
    }

    #[OA\Put(
        path: '/api/ruchers/{rucher}',
        operationId: 'updateRucher',
        summary: 'Mettre a jour un rucher',
        security: [['sanctum' => []]],
        tags: ['Ruchers'],
        parameters: [
            new OA\Parameter(
                name: 'rucher',
                description: 'ID du rucher',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateRucherRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Rucher mis a jour',
                content: new OA\JsonContent(ref: '#/components/schemas/RucherWriteResponse')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 403, description: 'Acces refuse'),
            new OA\Response(response: 404, description: 'Rucher introuvable'),
            new OA\Response(response: 422, description: 'Erreur de validation'),
        ]
    )]
    public function update(UpdateRucherRequest $request, Rucher $rucher): JsonResponse
    {
        abort_if($rucher->user_id !== $request->user()->id, 403);

        $rucher->update($request->validated());

        return response()->json([
            'message' => 'Rucher mis a jour',
            'data' => $rucher->fresh(),
        ]);
    }

    #[OA\Delete(
        path: '/api/ruchers/{rucher}',
        operationId: 'destroyRucher',
        summary: 'Supprimer un rucher',
        security: [['sanctum' => []]],
        tags: ['Ruchers'],
        parameters: [
            new OA\Parameter(
                name: 'rucher',
                description: 'ID du rucher',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Rucher supprime',
                content: new OA\JsonContent(ref: '#/components/schemas/MessageResponse')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 403, description: 'Acces refuse'),
            new OA\Response(response: 404, description: 'Rucher introuvable'),
        ]
    )]
    public function destroy(Request $request, Rucher $rucher): JsonResponse
    {
        abort_if($rucher->user_id !== $request->user()->id, 403);

        $rucher->delete();

        return response()->json([
            'message' => 'Rucher supprime',
        ]);
    }
}
