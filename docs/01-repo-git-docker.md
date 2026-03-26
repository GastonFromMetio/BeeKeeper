# BeeKeeper - Repo, branches et conteneurisation

## Objectif

Construire un mono-repo `BeeKeeper` avec :

- un backend API en PHP avec Laravel ;
- un frontend React separe ;
- une base MySQL ;
- une execution locale via Docker Compose ;
- une strategie Git simple et defendable pour un projet de cours.

## Stack retenue

- Backend : Laravel API
- PHP : 8.4
- Authentification : Laravel Sanctum en mode token
- Base de donnees : MySQL 8.4
- Frontend : React avec Vite
- Runtime front : Node 22 LTS
- Proxy HTTP backend : Nginx
- Orchestration : Docker Compose

Pourquoi cette stack :

- Laravel donne une structure claire pour les controllers, routes, middleware, validation et auth.
- React + Vite est plus propre que Create React App, qui est deprecie.
- Le mono-repo simplifie le rendu du projet et la gestion des branches.

## Arborescence conseillee

```text
BeeKeeper/
├── backend/
├── frontend/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── Dockerfile
├── docs/
│   ├── 01-repo-git-docker.md
│   └── 02-back-controllers-auth.md
├── compose.yaml
└── README.md
```

## Strategie Git

### Branches

- `main` : branche stable, propre, presentee comme reference fonctionnelle.
- `dev` : branche d'integration sur laquelle on assemble les fonctionnalites.
- `prod` : branche reservee au livrable final ou au deploiement.

### Flux conseille

1. Le travail courant part toujours de `dev`.
2. Chaque fonctionnalite part d'une branche `feature/...`.
3. Les branches `feature/...` sont fusionnees dans `dev`.
4. Quand `dev` est stable et testee, on fusionne vers `main`.
5. Quand la version de rendu est validee, on fusionne `main` vers `prod`.

### Conventions de nommage

- `feature/auth-token`
- `feature/crud-ruchers`
- `feature/crud-ruches`
- `fix/cors-react`
- `docs/setup-backend`

### Regles a respecter

- Ne jamais developper directement sur `main`.
- Ne jamais developper directement sur `prod`.
- Autoriser les commits directs sur `dev` uniquement si vous etes seul sur le projet.
- Si possible, proteger `main` et `prod` sur GitHub/GitLab.
- Taguer les rendus importants : `v0.1`, `v0.2`, `v1.0`.

### Sequence Git de depart

```bash
git init -b main
git checkout -b dev
git checkout -b prod
git checkout dev
```

### Routine de travail

```bash
git checkout dev
git pull origin dev
git checkout -b feature/crud-ruchers
```

Puis, une fois la fonctionnalite terminee :

```bash
git add .
git commit -m "feat(api): add ruchers CRUD"
git push origin feature/crud-ruchers
```

Ensuite :

- merge `feature/...` vers `dev`
- merge `dev` vers `main` quand la version est stable
- merge `main` vers `prod` pour la version finale

### Convention de commits

- `feat(api): add ruches CRUD`
- `feat(auth): add token login`
- `fix(front): handle expired token`
- `docs(repo): add docker workflow`

## Initialisation du projet

## 1. Creer le dossier racine

```bash
mkdir BeeKeeper
cd BeeKeeper
git init -b main
mkdir docs docker
```

## 2. Initialiser le backend Laravel

Laravel peut servir de backend API a une SPA JavaScript. C'est exactement le cas ici.

```bash
composer create-project laravel/laravel backend
```

Dans `backend/.env`, preparer au minimum :

```env
APP_NAME=BeeKeeper
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=beekeeper
DB_USERNAME=beekeeper
DB_PASSWORD=beekeeper
```

## 3. Initialiser le frontend React

React recommande de ne plus utiliser Create React App. Pour un projet de cours avec front separe, Vite est la bonne option.

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
cd ..
```

## 4. Fichiers d'environnement a versionner

A committer :

- `backend/.env.example`
- `frontend/.env.example`

A ne jamais committer :

- `backend/.env`
- `frontend/.env`
- `backend/vendor/`
- `frontend/node_modules/`

## Conteneurisation

## Ports proposes

- Front React : `5173`
- API Laravel via Nginx : `8080`
- MySQL : `3307` sur la machine, `3306` dans le container

## Fichier `compose.yaml`

```yaml
services:
  db:
    image: mysql:8.4
    container_name: beekeeper-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: beekeeper
      MYSQL_USER: beekeeper
      MYSQL_PASSWORD: beekeeper
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3307:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot"]
      interval: 10s
      timeout: 5s
      retries: 10

  backend:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    container_name: beekeeper-backend
    working_dir: /var/www/html
    volumes:
      - ./backend:/var/www/html
    depends_on:
      db:
        condition: service_healthy

  web:
    image: nginx:1.27-alpine
    container_name: beekeeper-nginx
    ports:
      - "8080:80"
    volumes:
      - ./backend:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - backend

  frontend:
    image: node:22-alpine
    container_name: beekeeper-frontend
    working_dir: /app
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0 --port 5173"
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - web

volumes:
  db_data:
```

## Fichier `docker/php/Dockerfile`

```dockerfile
FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    bash \
    curl \
    git \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    unzip \
    zip \
    mysql-client \
 && docker-php-ext-install \
    intl \
    mbstring \
    pdo_mysql \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
```

## Fichier `docker/nginx/default.conf`

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass backend:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

## Demarrage initial

Une fois les fichiers en place :

```bash
docker compose up -d --build
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan install:api
docker compose exec backend php artisan migrate
```

Si `vendor/` n'existe pas dans `backend`, lancer aussi :

```bash
docker compose exec backend composer install
```

Puis verifier :

- frontend : `http://localhost:5173`
- API : `http://localhost:8080`

## Bonnes pratiques de separation front/back

- Le backend expose uniquement une API JSON.
- Le frontend React consomme l'API via `fetch` ou `axios`.
- Aucune vue Blade n'est necessaire pour le rendu final.
- Les appels front doivent cibler `http://localhost:8080/api/...`

## Variables front conseillees

Dans `frontend/.env` :

```env
VITE_API_URL=http://localhost:8080/api
```

## Premiere checklist de mise en place

Avant d'attaquer les controllers, verifier ceci :

1. `docker compose up -d` fonctionne.
2. MySQL repond.
3. Laravel repond sur `http://localhost:8080`.
4. React repond sur `http://localhost:5173`.
5. Les `.env.example` sont presents.
6. Les branches `main`, `dev` et `prod` existent.
7. Le travail courant se fait depuis `dev`.

## Decision d'architecture a assumer a l'oral

Si on vous demande pourquoi ce choix :

- mono-repo pour simplifier l'evaluation ;
- Laravel pour structurer proprement controllers, routes, validation et auth ;
- React separe pour bien distinguer front et back ;
- Docker pour garantir un environnement identique ;
- `dev -> main -> prod` pour montrer une gestion de cycle de vie du code.
