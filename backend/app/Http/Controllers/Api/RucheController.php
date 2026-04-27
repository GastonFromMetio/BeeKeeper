<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ruche\StoreRucheRequest;
use App\Http\Requests\Ruche\UpdateRucheRequest;
use App\Models\Ruche;
use App\Models\Rucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class RucheController extends Controller
{
    #[OA\Get(
        path: '/api/ruches',
        operationId: 'listRuches',
        summary: 'Lister les ruches de l utilisateur connecte',
        security: [['sanctum' => []]],
        tags: ['Ruches'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste des ruches',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/Ruche')
                )
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $ruches = Ruche::query()
            ->whereHas('rucher', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->latest()
            ->get();

        return response()->json($ruches);
    }

    #[OA\Post(
        path: '/api/ruches',
        operationId: 'storeRuche',
        summary: 'Creer une ruche',
        security: [['sanctum' => []]],
        tags: ['Ruches'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/StoreRucheRequest')
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Ruche creee',
                content: new OA\JsonContent(ref: '#/components/schemas/RucheWriteResponse')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 422, description: 'Erreur de validation'),
        ]
    )]
    public function store(StoreRucheRequest $request): JsonResponse
    {
        $data = $request->validated();

        $rucher = Rucher::where('id', $data['rucher_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $ruche = $rucher->ruches()->create($data);

        return response()->json([
            'message' => 'Ruche creee',
            'data' => $ruche,
        ], 201);
    }

    #[OA\Get(
        path: '/api/ruches/{ruche}',
        operationId: 'showRuche',
        summary: 'Afficher une ruche',
        security: [['sanctum' => []]],
        tags: ['Ruches'],
        parameters: [
            new OA\Parameter(
                name: 'ruche',
                description: 'ID de la ruche',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Ruche trouvee',
                content: new OA\JsonContent(ref: '#/components/schemas/Ruche')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 403, description: 'Acces refuse'),
            new OA\Response(response: 404, description: 'Ruche introuvable'),
        ]
    )]
    public function show(Request $request, Ruche $ruche): JsonResponse
    {
        abort_if($ruche->rucher->user_id !== $request->user()->id, 403);

        return response()->json($ruche->load('rucher'));
    }

    #[OA\Put(
        path: '/api/ruches/{ruche}',
        operationId: 'updateRuche',
        summary: 'Mettre a jour une ruche',
        security: [['sanctum' => []]],
        tags: ['Ruches'],
        parameters: [
            new OA\Parameter(
                name: 'ruche',
                description: 'ID de la ruche',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateRucheRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Ruche mise a jour',
                content: new OA\JsonContent(ref: '#/components/schemas/RucheWriteResponse')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 403, description: 'Acces refuse'),
            new OA\Response(response: 404, description: 'Ruche introuvable'),
            new OA\Response(response: 422, description: 'Erreur de validation'),
        ]
    )]
    public function update(UpdateRucheRequest $request, Ruche $ruche): JsonResponse
    {
        abort_if($ruche->rucher->user_id !== $request->user()->id, 403);

        $data = $request->validated();

        if (isset($data['rucher_id'])) {
            Rucher::where('id', $data['rucher_id'])
                ->where('user_id', $request->user()->id)
                ->firstOrFail();
        }

        $ruche->update($data);

        return response()->json([
            'message' => 'Ruche mise a jour',
            'data' => $ruche->fresh(),
        ]);
    }

    #[OA\Delete(
        path: '/api/ruches/{ruche}',
        operationId: 'destroyRuche',
        summary: 'Supprimer une ruche',
        security: [['sanctum' => []]],
        tags: ['Ruches'],
        parameters: [
            new OA\Parameter(
                name: 'ruche',
                description: 'ID de la ruche',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 1)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Ruche supprimee',
                content: new OA\JsonContent(ref: '#/components/schemas/MessageResponse')
            ),
            new OA\Response(response: 401, description: 'Non authentifie'),
            new OA\Response(response: 403, description: 'Acces refuse'),
            new OA\Response(response: 404, description: 'Ruche introuvable'),
        ]
    )]
    public function destroy(Request $request, Ruche $ruche): JsonResponse
    {
        abort_if($ruche->rucher->user_id !== $request->user()->id, 403);

        $ruche->delete();

        return response()->json([
            'message' => 'Ruche supprimee',
        ]);
    }
}
