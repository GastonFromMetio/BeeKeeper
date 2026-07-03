# BeeKeeper

BeeKeeper est une application de gestion apicole. Le projet permet de gerer des ruchers, leurs ruches, leurs coordonnees GPS et des releves meteo associes aux emplacements.

Le depot contient une API Laravel et une application React/Vite qui consomme cette API.

## Architecture

```text
BeeKeeper/
├── backend/          API Laravel
├── frontend/         Application React + Vite
├── docker/           Configuration PHP/Nginx
├── docker-compose.yaml
└── README.md
```

### Backend

Le dossier `backend/` contient l'API REST Laravel.

Elements principaux:

- `routes/api.php` : routes API exposees au frontend.
- `app/Http/Controllers/Api/` : controleurs API.
- `app/Models/` : modeles Eloquent (`User`, `Rucher`, `Ruche`, `WeatherReport`).
- `database/migrations/` : schema de base de donnees.
- `database/seeders/DatabaseSeeder.php` : donnees d'exemple.
- `tests/Feature/` : tests API.

Routes principales:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `DELETE /api/auth/logout`
- `GET /api/ruchers`
- `POST /api/ruchers`
- `GET /api/ruchers/{id}`
- `PUT /api/ruchers/{id}`
- `DELETE /api/ruchers/{id}`
- `GET /api/ruches`
- `POST /api/ruches`
- `GET /api/ruches/{id}`
- `PUT /api/ruches/{id}`
- `DELETE /api/ruches/{id}`
- `GET /api/ruchers/{id}/weather`
- `POST /api/ruchers/{id}/weather`

### Frontend

Le dossier `frontend/` contient l'application React.

Elements principaux:

- `src/router/` : configuration des routes React Router.
- `src/pages/` : pages principales de l'application.
- `src/layouts/` : layouts d'authentification et d'application.
- `src/components/` : composants UI et metier.
- `src/contexts/` : contextes React (`AuthContext`, `WeatherContext`).
- `src/hooks/` : hooks custom pour les requetes GET.
- `src/services/` : fonctions API pour les requetes HTTP.
- `src/i18n/` : configuration des traductions FR/EN.
- `src/__tests__/` : tests de composants.

Routes frontend principales:

- `/login`
- `/register`
- `/dashboard`
- `/ruchers`
- `/ruchers/:rucherId`
- `/ruches`
- `/settings`

## Prerequis

Pour lancer le projet avec Docker:

- Docker
- Docker Compose

Pour lancer les parties separement sans Docker:

- PHP 8.3+
- Composer
- Node.js
- npm
- MySQL

La methode Docker est recommandee pour tester rapidement le projet.

## Lancement avec Docker

Depuis la racine du projet:

```bash
docker compose up -d
```

Les services exposes sont:

- Frontend: http://localhost:5173
- Backend/API: http://localhost:8080
- MySQL: localhost:3307

Ensuite, lancer les migrations et les donnees d'exemple:

```bash
docker compose exec backend php artisan migrate --seed
```

Si la base existe deja et que vous voulez repartir de zero:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

## Compte de demonstration

Le seeder cree un utilisateur de demonstration:

```text
Email: test@example.com
Mot de passe: password
```

Il cree aussi plusieurs ruchers et ruches pour tester directement le dashboard et les pages de gestion.

## Configuration

### Backend

Le fichier `backend/.env` contient la configuration Laravel.

Avec Docker, la configuration MySQL attendue est:

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=beekeeper
DB_USERNAME=beekeeper
DB_PASSWORD=beekeeper
```

Si vous lancez Laravel sans Docker, adaptez ces valeurs a votre instance MySQL locale.

### Frontend

Le frontend utilise par defaut l'API suivante:

```text
http://localhost:8080/api
```

Cette valeur est configuree dans `frontend/src/services/apiClient.js`.

Il est aussi possible de la surcharger avec une variable d'environnement Vite:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Commandes utiles

### Frontend

Depuis `frontend/`:

```bash
npm install
npm run dev
npm run lint
npm test -- --run
npm run build
```

### Backend

Depuis `backend/`:

```bash
composer install
php artisan migrate --seed
php artisan test
```

Avec Docker:

```bash
docker compose exec backend php artisan test
```

## Tests et qualite

Frontend:

- ESLint est configure avec `npm run lint`.
- Les tests de composants utilisent Vitest et Testing Library avec `npm test -- --run`.
- Le build de production se lance avec `npm run build`.

Backend:

- Les tests Laravel se lancent avec `php artisan test`.
- Les tests couvrent notamment l'authentification, les ruchers et la meteo.

## Fonctionnalites principales

- Authentification avec token Sanctum.
- Routes protegees cote frontend.
- Gestion des ruchers.
- Gestion des ruches.
- Coordonnees GPS des ruchers.
- Consultation et historique de meteo par rucher.
- Dashboard avec statistiques.
- Traductions francais/anglais.
- Mode clair/sombre.
- Donnees d'exemple via seeder.

## Workflow conseille apres fork

1. Cloner le depot.
2. Copier/verifier le fichier `backend/.env` si necessaire.
3. Lancer les conteneurs:

```bash
docker compose up -d
```

4. Initialiser la base:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

5. Ouvrir le frontend:

```text
http://localhost:5173
```

6. Se connecter avec:

```text
test@example.com
password
```

## Arret des services

Pour arreter les conteneurs:

```bash
docker compose down
```

Pour supprimer aussi les donnees MySQL Docker:

```bash
docker compose down -v
```
