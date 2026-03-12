# Homelyy

Homelyy is a practical fullstack portfolio project for an appliance ecommerce website.

## Main features
- Modern React storefront: home, product listing, product detail, cart, checkout.
- Auth flow with protected routes: login, register, profile, order history.
- Admin base module: dashboard, product management, order management.
- Voice Control highlight: navigate, search, and filter with speech commands.
- Mock API architecture ready to swap with real backend endpoints.

## Tech stack
- Frontend: React 19, TypeScript, React Router, Context API, Vite.
- Backend: Node.js, Express, CORS, dotenv, morgan.
- Deployment: Docker, docker-compose, Nginx (frontend static hosting).

## Project structure
```text
.
|- frontend/
|  |- src/
|  |  |- app/
|  |  |- components/
|  |  |- contexts/
|  |  |- features/
|  |  |- hooks/
|  |  |- pages/
|  |  |- services/
|  |  |- types/
|  |  |- utils/
|- backend/
|  |- src/
|  |  |- config/
|  |  |- controllers/
|  |  |- middlewares/
|  |  |- models/
|  |  |- routes/
|  |  |- services/
|  |  |- utils/
|- docs/
|  |- phase-roadmap.md
|  |- scope-and-flow.md
|  |- database-schema.md
|  |- rest-api.md
|- docker-compose.yml
```

## Local setup

### 1) Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 2) Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at `http://localhost:4000`.

## Docker setup
```bash
docker compose up --build
```
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000/api/health`

## Environment variables
- Frontend: copy `frontend/.env.example` to `frontend/.env`
  - `VITE_API_BASE_URL=http://localhost:4000/api`
  - `VITE_USE_MOCK_API=true` (set to `false` to call backend)
- Backend: copy `backend/.env.example` to `backend/.env`

## Supported voice commands
- `vao trang chu`
- `mo trang san pham`
- `mo gio hang`
- `tim [ten san pham]`
- `quay lai`
- `loc category [ten danh muc]`
- `loc gia duoi [so tien]`
- `loc gia tren [so tien]`

## Architecture notes
- Frontend is feature-based and keeps mock data out of UI components.
- Services can switch from mock to real API by `VITE_USE_MOCK_API`.
- Backend follows controller-service-route layering for maintainability.

## Next improvements
- Replace mock DB with PostgreSQL or MongoDB.
- Add JWT auth + refresh token.
- Add tests (Vitest + React Testing Library + Supertest).
