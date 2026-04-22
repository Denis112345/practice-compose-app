# Practice Compose App

Небольшой fullstack-проект для практики Docker Compose.

В приложении есть Vue 3 frontend, NestJS backend, PostgreSQL и Redis. Пользователь может зарегистрироваться, войти в аккаунт и создавать простые заметки.

## Структура проекта

- `frontend` - приложение на Vite + Vue 3.
- `backend` - API на NestJS.
- `db` - база PostgreSQL для пользователей и заметок.
- `redis` - хранилище bearer-сессий.
- `docker-compose.yml` - запускает все сервисы вместе.

## Быстрый запуск через Docker Compose

Перед запуском убедитесь, что существуют файлы:

- `backend/.env`
- `frontend/.env`

У каждого сервиса также есть файл `.env.example`. Если `.env` отсутствует, создайте его на основе соответствующего примера и проверьте значения для Compose.

Запустить весь стек:

```bash
docker compose up --build
```

После запуска:

- frontend: `http://localhost:8251`
- backend API: `http://localhost:8512`
- healthcheck: `http://localhost:8512/health`

Остановить стек:

```bash
docker compose down
```

Данные PostgreSQL сохраняются в локальной папке `db_data`. Чтобы сбросить базу, остановите стек и удалите эту папку.

## Переменные окружения

### Backend для Compose

```env
PORT=3001
DATABASE_URL=postgresql://usr:pswd@db:5432/default_db
REDIS_URL=redis://redis:6379/0
SESSION_TTL_SECONDS=3600
CORS_ORIGINS=*
```

Внутри Docker Compose backend должен обращаться к сервисам по DNS-именам: `db` для PostgreSQL и `redis` для Redis.

### Frontend для Compose

```env
VITE_API_BASE=http://localhost:8251/api
```

Контейнер frontend собирает статические файлы и раздает их через nginx. Запросы на `/api` проксируются в backend-сервис.

## Локальная разработка без Compose

Для запуска без Docker Compose нужно отдельно запустить PostgreSQL и Redis, а затем указать локальные адреса сервисов в `backend/.env`.

Пример `backend/.env` для локальной разработки:

```env
PORT=8000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/practice_db
REDIS_URL=redis://localhost:6379/0
SESSION_TTL_SECONDS=3600
CORS_ORIGINS=http://localhost:5173
```

Пример `frontend/.env` для локальной разработки:

```env
VITE_API_BASE=http://localhost:8000
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

По умолчанию локальный frontend запускается на `http://localhost:5173`.

## Команды сборки

Backend:

```bash
cd backend
npm run build
npm run start:prod
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

## API

- `GET /` - базовая проверка API.
- `GET /health` - проверка API, PostgreSQL и Redis.
- `POST /auth/register` - создать пользователя.
- `POST /auth/login` - войти и получить bearer token.
- `POST /auth/logout` - удалить сессию из Redis.
- `GET /auth/me` - получить текущего пользователя.
- `GET /notes` - получить заметки текущего пользователя.
- `POST /notes` - создать заметку.

Для защищенных маршрутов нужен заголовок:

```http
Authorization: Bearer <token>
```

## Заметки по Compose

- `front` собирается из `./frontend` и публикуется на порту `8251`.
- `backend` собирается из `./backend` и публикуется на порту `8512`.
- `db` использует образ `postgres:18.3-alpine3.23`.
- `redis` использует образ `redis:8.6.2-alpine`.
- Данные PostgreSQL сохраняются в локальной папке `db_data`.
- `backend` стартует после успешных healthcheck у `db` и `redis`.
- `front` стартует после успешного healthcheck у `backend`.
