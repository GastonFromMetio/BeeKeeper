# BeeKeeper - Creation des controllers et authentification par token

## Objectif pedagogique

Le cahier des charges impose :

- les verbes `GET`, `POST`, `PUT`, `DELETE` ;
- minimum `3 controllers` ;
- minimum `12 points d'entree`.

Pour BeeKeeper, la structure la plus simple est :

- `AuthController`
- `RucherController`
- `RucheController`

Cette organisation couvre largement le minimum demande.

## Modele fonctionnel retenu

L'application gere :

- des utilisateurs ;
- des ruchers ;
- des ruches ;
- des tokens d'acces.

## Tables recommandees

### `users`

- `id`
- `name`
- `email`
- `password`
- `created_at`
- `updated_at`

### `ruchers`

- `id`
- `user_id`
- `nom`
- `localisation`
- `description`
- `nb_emplacements`
- `created_at`
- `updated_at`

### `ruches`

- `id`
- `rucher_id`
- `nom`
- `statut`
- `type_ruche`
- `annee_reine`
- `notes`
- `created_at`
- `updated_at`

### `personal_access_tokens`

Cette table est creee par Sanctum pour stocker les tokens.

## Relations a prevoir

- un `User` possede plusieurs `Rucher`
- un `Rucher` appartient a un `User`
- un `Rucher` possede plusieurs `Ruche`
- une `Ruche` appartient a un `Rucher`

## Liste des controllers

## 1. `AuthController`

Responsabilites :

- inscription ;
- connexion ;
- recuperation de l'utilisateur connecte ;
- mise a jour du profil ou du mot de passe ;
- deconnexion par suppression du token courant.

### Endpoints conseilles

| Verbe | Route | Action |
|---|---|---|
| GET | `/api/auth/me` | Retourner l'utilisateur connecte |
| POST | `/api/auth/login` | Connecter l'utilisateur et generer un token |
| POST | `/api/auth/register` | Creer un utilisateur et generer un token |
| PUT | `/api/auth/profile` | Mettre a jour le profil |
| DELETE | `/api/auth/logout` | Revoquer le token courant |

## 2. `RucherController`

Responsabilites :

- CRUD complet des ruchers.

### Endpoints conseilles

| Verbe | Route | Action |
|---|---|---|
| GET | `/api/ruchers` | Lister les ruchers de l'utilisateur |
| GET | `/api/ruchers/{id}` | Afficher un rucher |
| POST | `/api/ruchers` | Creer un rucher |
| PUT | `/api/ruchers/{id}` | Modifier un rucher |
| DELETE | `/api/ruchers/{id}` | Supprimer un rucher |

## 3. `RucheController`

Responsabilites :

- CRUD complet des ruches.

### Endpoints conseilles

| Verbe | Route | Action |
|---|---|---|
| GET | `/api/ruches` | Lister les ruches |
| GET | `/api/ruches/{id}` | Afficher une ruche |
| POST | `/api/ruches` | Creer une ruche |
| PUT | `/api/ruches/{id}` | Modifier une ruche |
| DELETE | `/api/ruches/{id}` | Supprimer une ruche |

Avec cette base, vous avez deja 15 endpoints, donc plus que le minimum de 12.

## Etapes de creation du back

## 1. Installer l'API et Sanctum

Dans le dossier `backend` :

```bash
php artisan install:api
```

Effet attendu :

- installation de Sanctum ;
- creation de la table des tokens ;
- configuration de base pour l'API.

Dans `app/Models/User.php`, verifier aussi la presence du trait :

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

## 2. Creer les modeles et migrations metier

```bash
php artisan make:model Rucher -m
php artisan make:model Ruche -m
```

Ensuite remplir les migrations.

### Migration `ruchers`

Points importants :

- `user_id` en cle etrangere ;
- suppression en cascade possible si l'utilisateur est supprime.

### Migration `ruches`

Points importants :

- `rucher_id` en cle etrangere ;
- si vous voulez un comportement simple, utilisez `cascadeOnDelete()` pour supprimer les ruches quand un rucher est supprime.

## 3. Creer les controllers

```bash
php artisan make:controller Api/AuthController
php artisan make:controller Api/RucherController --api --model=Rucher
php artisan make:controller Api/RucheController --api --model=Ruche
```

## 4. Creer les Form Requests

Pour garder des controllers propres :

```bash
php artisan make:request Auth/LoginRequest
php artisan make:request Auth/RegisterRequest
php artisan make:request Auth/UpdateProfileRequest
php artisan make:request Rucher/StoreRucherRequest
php artisan make:request Rucher/UpdateRucherRequest
php artisan make:request Ruche/StoreRucheRequest
php artisan make:request Ruche/UpdateRucheRequest
```

## 5. Declarer les relations Eloquent

### `User`

- `hasMany(Rucher::class)`

### `Rucher`

- `belongsTo(User::class)`
- `hasMany(Ruche::class)`

### `Ruche`

- `belongsTo(Rucher::class)`

## 6. Definir les routes dans `routes/api.php`

Pour un projet de cours, declarez les verbes explicitement. C'est plus lisible pour montrer que vous utilisez bien `GET`, `POST`, `PUT`, `DELETE`.

```php
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

## 7. Configurer le CORS pour React

Comme le frontend tournera sur `http://localhost:5173` et l'API sur `http://localhost:8080`, il faut autoriser cette origine.

Dans `config/cors.php`, verifier au minimum :

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_headers' => ['*'],
```

Avec une authentification par Bearer token, le point important est surtout d'autoriser l'origine du frontend et les en-tetes HTTP.

## 8. Implementer la logique des controllers

## `AuthController`

Methodes minimales :

- `register()`
- `login()`
- `me()`
- `updateProfile()`
- `logout()`

Comportement attendu :

- `register()` cree l'utilisateur, hash le mot de passe, cree un token et le retourne ;
- `login()` verifie email + mot de passe, cree un token et le retourne ;
- `me()` retourne l'utilisateur connecte ;
- `updateProfile()` modifie le nom, l'email ou le mot de passe selon votre choix ;
- `logout()` supprime le token courant.

## `RucherController`

Methodes minimales :

- `index()`
- `show()`
- `store()`
- `update()`
- `destroy()`

Regle importante :

- un utilisateur ne doit voir que ses propres ruchers.

## `RucheController`

Methodes minimales :

- `index()`
- `show()`
- `store()`
- `update()`
- `destroy()`

Regles importantes :

- une ruche doit appartenir a un rucher existant ;
- si vous voulez rester simple, n'autorisez la creation d'une ruche que dans un rucher appartenant a l'utilisateur connecte.

## Gestion des tokens

## Choix technique

Pour ce projet, utiliser des `personal access tokens` avec Sanctum.

Note importante :

- dans une SPA first-party classique, Sanctum recommande plutot l'authentification par cookie/session ;
- ici, le projet demande explicitement une authentification par token ;
- ce choix est donc pedagogique, simple a demonstrer et coherent avec une API separee.

## Cycle de vie d'un token

### 1. Creation

Au `register` ou au `login`, le backend cree un token :

```php
$token = $user->createToken('react-client')->plainTextToken;
```

Le backend retourne ensuite :

```json
{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  },
  "token": "token_en_clair_retourne_une_seule_fois"
}
```

### 2. Stockage backend

Le token n'est pas stocke en clair dans la base.

Sanctum :

- stocke une version hashee du token dans `personal_access_tokens` ;
- ne permet de recuperer le token en clair qu'au moment de sa creation.

### 3. Stockage frontend

Pour un projet de cours simple, deux options :

- `localStorage` : simple a montrer, mais moins robuste en securite ;
- memoire applicative : plus propre, mais le token disparait au refresh.

Choix pedagogique acceptable :

- `localStorage` pour la demonstration ;
- expliquer a l'oral que ce n'est pas le meilleur choix pour une application sensible.

### 4. Envoi du token

Le frontend envoie le token dans l'en-tete HTTP :

```http
Authorization: Bearer VOTRE_TOKEN
```

### 5. Verification

Les routes protegees utilisent :

```php
->middleware('auth:sanctum')
```

### 6. Revocation

Au logout :

```php
$request->user()->currentAccessToken()->delete();
```

Cela invalide le token utilise pour la requete courante.

## Politique de token recommandee

Pour rester simple et propre :

- un token par session de connexion ;
- revocation du token courant au logout ;
- possibilite future de supprimer tous les tokens d'un utilisateur ;
- expiration manuelle configurable si vous voulez montrer un effort de securite.

Exemple defendable :

- expiration de 7 jours ;
- suppression des tokens expires via tache planifiee plus tard si necessaire.

## Validation minimale par entite

## `register`

- `name` requis
- `email` requis, format email, unique
- `password` requis, confirme

## `login`

- `email` requis
- `password` requis

## `rucher`

- `nom` requis
- `localisation` requise
- `description` nullable
- `nb_emplacements` entier positif

## `ruche`

- `rucher_id` requis, existe
- `nom` requis
- `statut` requis
- `type_ruche` requis
- `annee_reine` nullable, entier
- `notes` nullable

## Exemple de scenario de test manuel

1. `POST /api/auth/register`
2. recuperer le token renvoye
3. appeler `GET /api/auth/me` avec le Bearer token
4. `POST /api/ruchers`
5. `GET /api/ruchers`
6. `PUT /api/ruchers/{id}`
7. `POST /api/ruches`
8. `GET /api/ruches`
9. `PUT /api/ruches/{id}`
10. `DELETE /api/ruches/{id}`
11. `DELETE /api/ruchers/{id}`
12. `DELETE /api/auth/logout`

## Version minimale defendable pour le cours

Si vous voulez aller a l'essentiel sans vous disperser :

- 1 utilisateur authentifie ;
- 1 table `ruchers` ;
- 1 table `ruches` ;
- 3 controllers ;
- 15 routes visibles ;
- auth par Bearer token ;
- tests manuels via Postman, Bruno ou Thunder Client.

## Ce qu'il faudra pouvoir expliquer

A l'oral, vous devez pouvoir justifier :

- pourquoi il y a 3 controllers distincts ;
- comment chaque controller utilise bien `GET`, `POST`, `PUT`, `DELETE` ;
- comment le token est cree, envoye, verifie et revoque ;
- pourquoi `auth:sanctum` protege les routes ;
- pourquoi un utilisateur ne doit pas acceder aux ruchers d'un autre utilisateur.
