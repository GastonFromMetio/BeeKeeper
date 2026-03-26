# BeeKeeper - Guide detaille pour creer les controllers REST Laravel

## Objectif

Ce guide sert a construire la partie back de `BeeKeeper` sous forme d'API REST en PHP avec Laravel.

Le but final est d'obtenir :

- une authentification par token ;
- 3 controllers distincts ;
- des routes en `GET`, `POST`, `PUT`, `DELETE` ;
- une structure propre et defendable pour le projet de cours.

Les 3 controllers retenus :

- `AuthController`
- `RucherController`
- `RucheController`

## Point de depart actuel

Ton projet backend est presque vierge :

- Laravel est installe ;
- aucune route API n'existe encore ;
- aucun controller metier n'existe ;
- aucun modele `Rucher` ou `Ruche` n'existe ;
- l'authentification API n'est pas encore installee.

Donc on part sur un vrai pas-a-pas.

## Architecture cible

Le back devra gerer :

- les utilisateurs ;
- les ruchers ;
- les ruches ;
- les tokens d'acces.

Relations metier :

- un utilisateur possede plusieurs ruchers ;
- un rucher contient plusieurs ruches ;
- une ruche appartient a un seul rucher.

## Resultat attendu a la fin

Tu auras au minimum les endpoints suivants :

| Verbe | Route | Controller | Methode |
|---|---|---|---|
| POST | `/api/auth/register` | `AuthController` | `register` |
| POST | `/api/auth/login` | `AuthController` | `login` |
| GET | `/api/auth/me` | `AuthController` | `me` |
| PUT | `/api/auth/profile` | `AuthController` | `updateProfile` |
| DELETE | `/api/auth/logout` | `AuthController` | `logout` |
| GET | `/api/ruchers` | `RucherController` | `index` |
| GET | `/api/ruchers/{rucher}` | `RucherController` | `show` |
| POST | `/api/ruchers` | `RucherController` | `store` |
| PUT | `/api/ruchers/{rucher}` | `RucherController` | `update` |
| DELETE | `/api/ruchers/{rucher}` | `RucherController` | `destroy` |
| GET | `/api/ruches` | `RucheController` | `index` |
| GET | `/api/ruches/{ruche}` | `RucheController` | `show` |
| POST | `/api/ruches` | `RucheController` | `store` |
| PUT | `/api/ruches/{ruche}` | `RucheController` | `update` |
| DELETE | `/api/ruches/{ruche}` | `RucheController` | `destroy` |

Tu couvres donc 15 points d'entree, largement au-dessus du minimum impose.

## Ordre de travail recommande

Fais les etapes exactement dans cet ordre :

1. activer l'API Laravel ;
2. creer les modeles et migrations ;
3. declarer les relations Eloquent ;
4. installer l'authentification token ;
5. creer les Form Requests ;
6. creer les controllers ;
7. declarer les routes API ;
8. tester les endpoints un par un.

## Etape 1 - Activer l'API dans Laravel

Actuellement, ton projet n'a pas encore de fichier `routes/api.php`.

Dans le dossier `backend`, lance :

```bash
php artisan install:api
```

Cette commande va :

- creer `routes/api.php` ;
- installer Sanctum par defaut ;
- preparer la base pour l'authentification API.

### Ce que tu dois verifier apres la commande

1. le fichier `routes/api.php` existe ;
2. une migration pour les tokens existe ;
3. `composer.json` contient Sanctum ;
4. les migrations peuvent etre lancees.

Ensuite, execute :

```bash
php artisan migrate
```

## Etape 2 - Creer les modeles metier

Tu as deja `User`.

Il faut maintenant ajouter :

- `Rucher`
- `Ruche`

Commande :

```bash
php artisan make:model Rucher -m
php artisan make:model Ruche -m
```

Le `-m` cree aussi une migration.

## Etape 3 - Ecrire les migrations

## 3.1 Migration `ruchers`

But :

- lier un rucher a un utilisateur ;
- stocker les infos minimales utiles.

Champs recommandes :

- `id`
- `user_id`
- `nom`
- `localisation`
- `description`
- `nb_emplacements`
- `timestamps`

Exemple de contenu :

```php
Schema::create('ruchers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('nom');
    $table->string('localisation');
    $table->text('description')->nullable();
    $table->unsignedInteger('nb_emplacements')->default(0);
    $table->timestamps();
});
```

## 3.2 Migration `ruches`

But :

- rattacher chaque ruche a un rucher.

Champs recommandes :

- `id`
- `rucher_id`
- `nom`
- `statut`
- `type_ruche`
- `annee_reine`
- `notes`
- `timestamps`

Exemple de contenu :

```php
Schema::create('ruches', function (Blueprint $table) {
    $table->id();
    $table->foreignId('rucher_id')->constrained()->cascadeOnDelete();
    $table->string('nom');
    $table->string('statut');
    $table->string('type_ruche');
    $table->unsignedInteger('annee_reine')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

Ensuite :

```bash
php artisan migrate
```

## Etape 4 - Declarer les relations Eloquent

Cette etape est indispensable avant d'ecrire les controllers.

## 4.1 Modifier `User`

Fichier :

- `app/Models/User.php`

Ajoute le trait de Sanctum :

```php
use Laravel\Sanctum\HasApiTokens;
```

Puis dans la classe :

```php
use HasApiTokens, HasFactory, Notifiable;
```

Ajoute aussi la relation :

```php
public function ruchers()
{
    return $this->hasMany(Rucher::class);
}
```

Pense aussi a importer `Rucher`.

## 4.2 Creer `Rucher`

Fichier :

- `app/Models/Rucher.php`

Contenu minimal conseille :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'nom', 'localisation', 'description', 'nb_emplacements'])]
class Rucher extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ruches(): HasMany
    {
        return $this->hasMany(Ruche::class);
    }
}
```

## 4.3 Creer `Ruche`

Fichier :

- `app/Models/Ruche.php`

Contenu minimal conseille :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['rucher_id', 'nom', 'statut', 'type_ruche', 'annee_reine', 'notes'])]
class Ruche extends Model
{
    public function rucher(): BelongsTo
    {
        return $this->belongsTo(Rucher::class);
    }
}
```

## Etape 5 - Installer et comprendre l'authentification par token

Avec `php artisan install:api`, Laravel installe Sanctum.

Le fonctionnement est simple :

1. l'utilisateur s'inscrit ou se connecte ;
2. Laravel cree un token ;
3. le frontend React stocke ce token ;
4. chaque requete protegee envoie :

```http
Authorization: Bearer TON_TOKEN
```

5. Laravel verifie le token avec le middleware `auth:sanctum`.

## Ce qu'il faut retenir

- le token en clair n'est retourne qu'une seule fois ;
- la base stocke seulement une version protegee du token ;
- au logout, on supprime le token courant.

## Etape 6 - Creer les Form Requests

Ne mets pas toute la validation directement dans les controllers.

Utilise des `FormRequest`.

Commandes :

```bash
php artisan make:request Auth/RegisterRequest --ok--
php artisan make:request Auth/LoginRequest --ok--
php artisan make:request Auth/UpdateProfileRequest
php artisan make:request Rucher/StoreRucherRequest --ok--
php artisan make:request Rucher/UpdateRucherRequest --ok--
php artisan make:request Ruche/StoreRucheRequest
php artisan make:request Ruche/UpdateRucheRequest
```

Important :

dans chaque `FormRequest` genere, Laravel met par defaut :

```php
public function authorize(): bool
{
    return false;
}
```

Tu dois donc le remplacer par :

```php
public function authorize(): bool
{
    return true;
}
```

## 6.1 Validation `RegisterRequest` --ok--

Regles recommandees :

```php
return [
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'email', 'max:255', 'unique:users,email'],
    'password' => ['required', 'confirmed', 'min:8'],
];
```

## 6.2 Validation `LoginRequest` --ok--

```php
return [
    'email' => ['required', 'email'],
    'password' => ['required', 'string'],
];
```

## 6.3 Validation `UpdateProfileRequest`

```php
return [
    'name' => ['sometimes', 'required', 'string', 'max:255'],
    'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:users,email,'.auth()->id()],
    'password' => ['nullable', 'confirmed', 'min:8'],
];
```

## 6.4 Validation `StoreRucherRequest` --ok--

```php
return [
    'name' => ['required', 'string', 'max:255'],
    'localisation' => ['required', 'string', 'max:255'],
    'description' => ['nullable', 'string'],
    'nb_emplacements' => ['required', 'integer', 'min:0'],
];
```

## 6.5 Validation `UpdateRucherRequest` --ok--

```php
return [
    'name' => ['sometimes', 'required', 'string', 'max:255'],
    'localisation' => ['sometimes', 'required', 'string', 'max:255'],
    'description' => ['nullable', 'string'],
    'nb_emplacements' => ['sometimes', 'required', 'integer', 'min:0'],
];
```

## 6.6 Validation `StoreRucheRequest`

```php
return [
    'rucher_id' => ['required', 'exists:ruchers,id'],
    'nom' => ['required', 'string', 'max:255'],
    'statut' => ['required', 'string', 'max:255'],
    'type_ruche' => ['required', 'string', 'max:255'],
    'annee_reine' => ['nullable', 'integer', 'min:2000'],
    'notes' => ['nullable', 'string'],
];
```

## 6.7 Validation `UpdateRucheRequest`

```php
return [
    'rucher_id' => ['sometimes', 'required', 'exists:ruchers,id'],
    'nom' => ['sometimes', 'required', 'string', 'max:255'],
    'statut' => ['sometimes', 'required', 'string', 'max:255'],
    'type_ruche' => ['sometimes', 'required', 'string', 'max:255'],
    'annee_reine' => ['nullable', 'integer', 'min:2000'],
    'notes' => ['nullable', 'string'],
];
```

## Etape 7 - Creer les controllers

## 7.1 AuthController

Commande :

```bash
php artisan make:controller Api/AuthController
```

Ce controller ne sera pas un controller CRUD classique. Il portera les actions d'authentification.

Methodes a creer :

- `register`
- `login`
- `me`
- `updateProfile`
- `logout`

## Exemple de logique pour `register`

But :

- creer l'utilisateur ;
- generer un token ;
- retourner le couple `user + token`.

Logique type :

```php
public function register(RegisterRequest $request): JsonResponse
{
    $user = User::create($request->validated());

    $token = $user->createToken('react-client')->plainTextToken;

    return response()->json([
        'message' => 'Inscription reussie',
        'user' => $user,
        'token' => $token,
    ], 201);
}
```

## Exemple de logique pour `login`

But :

- verifier email et mot de passe ;
- creer un token si les identifiants sont corrects.

Logique type :

```php
public function login(LoginRequest $request): JsonResponse
{
    $user = User::where('email', $request->validated()['email'])->first();

    if (! $user || ! Hash::check($request->validated()['password'], $user->password)) {
        return response()->json([
            'message' => 'Identifiants invalides',
        ], 401);
    }

    $token = $user->createToken('react-client')->plainTextToken;

    return response()->json([
        'message' => 'Connexion reussie',
        'user' => $user,
        'token' => $token,
    ]);
}
```

## Exemple de logique pour `me`

```php
public function me(Request $request): JsonResponse
{
    return response()->json($request->user());
}
```

## Exemple de logique pour `updateProfile`

```php
public function updateProfile(UpdateProfileRequest $request): JsonResponse
{
    $user = $request->user();

    $data = $request->validated();

    if (empty($data['password'])) {
        unset($data['password']);
    }

    $user->update($data);

    return response()->json([
        'message' => 'Profil mis a jour',
        'user' => $user->fresh(),
    ]);
}
```

## Exemple de logique pour `logout`

```php
public function logout(Request $request): JsonResponse
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Deconnexion reussie',
    ]);
}
```

## 7.2 RucherController

Commande :

```bash
php artisan make:controller Api/RucherController --api --model=Rucher
```

Le flag `--api` genere un controller de type REST sans les methodes de formulaire HTML.

Tu obtiendras les methodes :

- `index`
- `store`
- `show`
- `update`
- `destroy`

## Regle de securite importante

Un utilisateur ne doit voir que ses propres ruchers.

Donc :

- `index` filtre par `user_id` ;
- `show` doit verifier que le rucher appartient au user courant ;
- `update` pareil ;
- `destroy` pareil.

## Exemple de logique pour `index`

```php
public function index(Request $request): JsonResponse
{
    $ruchers = $request->user()->ruchers()->latest()->get();

    return response()->json($ruchers);
}
```

## Exemple de logique pour `store`

```php
public function store(StoreRucherRequest $request): JsonResponse
{
    $rucher = $request->user()->ruchers()->create($request->validated());

    return response()->json([
        'message' => 'Rucher cree',
        'data' => $rucher,
    ], 201);
}
```

## Exemple de logique pour `show`

```php
public function show(Request $request, Rucher $rucher): JsonResponse
{
    abort_if($rucher->user_id !== $request->user()->id, 403);

    return response()->json($rucher);
}
```

## Exemple de logique pour `update`

```php
public function update(UpdateRucherRequest $request, Rucher $rucher): JsonResponse
{
    abort_if($rucher->user_id !== $request->user()->id, 403);

    $rucher->update($request->validated());

    return response()->json([
        'message' => 'Rucher mis a jour',
        'data' => $rucher->fresh(),
    ]);
}
```

## Exemple de logique pour `destroy`

```php
public function destroy(Request $request, Rucher $rucher): JsonResponse
{
    abort_if($rucher->user_id !== $request->user()->id, 403);

    $rucher->delete();

    return response()->json([
        'message' => 'Rucher supprime',
    ]);
}
```

## 7.3 RucheController

Commande :

```bash
php artisan make:controller Api/RucheController --api --model=Ruche
```

Ce controller est aussi un CRUD REST complet.

## Regle de securite importante

Une ruche doit toujours appartenir indirectement a l'utilisateur connecte via son rucher.

Autrement dit :

- on ne doit pas pouvoir creer une ruche dans le rucher d'un autre utilisateur ;
- on ne doit pas pouvoir lire, modifier ou supprimer une ruche d'un autre utilisateur.

## Exemple de logique pour `index`

```php
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
```

## Exemple de logique pour `store`

```php
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
```

## Exemple de logique pour `show`

```php
public function show(Request $request, Ruche $ruche): JsonResponse
{
    abort_if($ruche->rucher->user_id !== $request->user()->id, 403);

    return response()->json($ruche->load('rucher'));
}
```

## Exemple de logique pour `update`

```php
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
```

## Exemple de logique pour `destroy`

```php
public function destroy(Request $request, Ruche $ruche): JsonResponse
{
    abort_if($ruche->rucher->user_id !== $request->user()->id, 403);

    $ruche->delete();

    return response()->json([
        'message' => 'Ruche supprimee',
    ]);
}
```

## Etape 8 - Declarer les routes API

Fichier :

- `routes/api.php`

Contenu conseille :

```php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RucherController;
use App\Http\Controllers\Api\RucheController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::delete('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ruchers', [RucherController::class, 'index']);
    Route::get('/ruchers/{rucher}', [RucherController::class, 'show']);
    Route::post('/ruchers', [RucherController::class, 'store']);
    Route::put('/ruchers/{rucher}', [RucherController::class, 'update']);
    Route::delete('/ruchers/{rucher}', [RucherController::class, 'destroy']);

    Route::get('/ruches', [RucheController::class, 'index']);
    Route::get('/ruches/{ruche}', [RucheController::class, 'show']);
    Route::post('/ruches', [RucheController::class, 'store']);
    Route::put('/ruches/{ruche}', [RucheController::class, 'update']);
    Route::delete('/ruches/{ruche}', [RucheController::class, 'destroy']);
});
```

## Pourquoi declarer les routes explicitement

Tu pourrais utiliser `Route::apiResource()`, mais pour un projet de cours ce n'est pas ideal.

Mieux vaut tout ecrire explicitement car :

- on voit tres clairement les verbes HTTP ;
- c'est plus facile a presenter ;
- le correcteur voit directement le respect de la consigne.

## Etape 9 - Verifier la liste des routes

Commande :

```bash
php artisan route:list
```

Tu dois voir :

- les routes `auth/*`
- les routes `ruchers/*`
- les routes `ruches/*`

## Etape 10 - Tester avec Postman, Bruno ou Thunder Client

Ordre de test recommande :

1. `POST /api/auth/register`
2. recuperer le token
3. `GET /api/auth/me` avec le Bearer token
4. `POST /api/ruchers`
5. `GET /api/ruchers`
6. `PUT /api/ruchers/{id}`
7. `POST /api/ruches`
8. `GET /api/ruches`
9. `PUT /api/ruches/{id}`
10. `DELETE /api/ruches/{id}`
11. `DELETE /api/ruchers/{id}`
12. `DELETE /api/auth/logout`

## Exemples de payloads JSON

## Register

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

## Login

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

## Store rucher

```json
{
  "nom": "Rucher du jardin",
  "localisation": "Toulouse",
  "description": "Petit rucher familial",
  "nb_emplacements": 6
}
```

## Store ruche

```json
{
  "rucher_id": 1,
  "nom": "Ruche A1",
  "statut": "active",
  "type_ruche": "Dadant",
  "annee_reine": 2024,
  "notes": "Colonie calme"
}
```

## Codes HTTP a respecter

- `200` : succes standard
- `201` : ressource creee
- `401` : utilisateur non authentifie
- `403` : utilisateur authentifie mais non autorise
- `404` : ressource inexistante
- `422` : erreur de validation

## Erreurs a eviter

- creer un controller sans proteger les routes sensibles ;
- oublier `HasApiTokens` dans `User` ;
- oublier `auth:sanctum` sur les routes privees ;
- autoriser un utilisateur a lire les ruchers d'un autre ;
- mettre toute la validation dans le controller ;
- oublier de filtrer les ruches par proprietaire ;
- oublier de lancer `php artisan migrate`.

## Ce qu'il faut pouvoir expliquer a l'oral

- pourquoi il y a 3 controllers distincts ;
- pourquoi `AuthController` n'est pas un CRUD classique ;
- comment Laravel mappe les routes vers les methodes ;
- comment le token est genere, envoye et revoque ;
- pourquoi `RucherController` et `RucheController` doivent verifier le proprietaire ;
- pourquoi `FormRequest` rend le code plus propre.

## Checklist finale

Avant de considerer le back termine, verifie :

1. `php artisan install:api` a ete execute ;
2. `routes/api.php` existe ;
3. `User` utilise `HasApiTokens` ;
4. `Rucher` et `Ruche` existent ;
5. les migrations passent ;
6. les 3 controllers existent ;
7. les `FormRequest` existent ;
8. les routes sont visibles dans `php artisan route:list` ;
9. l'authentification par Bearer token fonctionne ;
10. les verbes `GET`, `POST`, `PUT`, `DELETE` sont bien utilises.

## Suite logique

Une fois ce guide applique, tu pourras passer au front React pour :

- stocker le token ;
- afficher les ruchers ;
- afficher les ruches ;
- creer, modifier et supprimer les ressources via l'API Laravel.
