# Homelyy

Homelyy is a full-stack e-commerce project for home appliance retail, built as a portfolio project with an end-to-end shopping and administration flow.  
The project focuses on practical backend concerns such as authentication, role-based access control, request validation, product and order management, media upload, and deployment-ready setup.  
It is designed to demonstrate more than basic CRUD by covering the core flows behind a small but realistic commerce system.

## Short Description

Homelyy simulates a complete online shopping workflow: product browsing, search and filtering, cart, checkout, order history, and admin operations.  
On the backend side, the project exposes a REST API with JWT-based authentication, admin-protected endpoints, validation rules, MongoDB models, seed data, and Cloudinary integration for image upload.  
The repository also includes deployment notes, API documentation, and database design references to support review, demo, and local setup.

## Key Features

### Customer Features

- Register, login, and update profile information
- Browse products, view product details, and explore featured catalog pages
- Search, filter, and sort products
- Add items to cart and complete checkout
- View personal order history after purchase
- Use voice commands on the frontend for navigation, search, and filtering

### Admin Features

- Access a dedicated admin dashboard
- Manage categories and products
- Manage orders and update processing status
- Manage users with admin-only operations
- Upload product and avatar images through Cloudinary

### Backend Capabilities

- REST API organized by domain modules
- JWT authentication for protected routes
- Role-based authorization for admin endpoints
- Validation rules for email, password, phone, quantity, rating, and order payloads
- MongoDB data models for users, products, categories, carts, orders, and reviews
- Seed workflow for demo data and faster local review

## Tech Stack

### Backend

- Node.js
- Express
- Mongoose
- JWT

### Frontend

- React 19
- TypeScript
- React Router
- Vite

### Database

- MongoDB Atlas

### DevOps / Deployment

- Docker
- Docker Compose
- Nginx

### Integrations

- Cloudinary
- Multer

## Architecture / Project Structure

```text
.
|-- backend/      # Express API, business logic, models, middleware, seed data
|-- frontend/     # Customer-facing UI and admin pages
|-- docs/         # Scope, API design, database schema, roadmap
|-- deploy.md     # Deployment notes
`-- README.md
```

Backend source code is separated into controllers, services, models, routes, middlewares, utilities, and seed scripts. This structure keeps request handling, business logic, and persistence concerns relatively clear and easier to extend.

## Setup and Run Locally

### Option 1: Manual Setup

1. Clone the repository

```powershell
git clone <your-repository-url>
cd Homelyy
```

2. Create environment files

```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

3. Configure required environment variables

Required minimum values:

- `MONGODB_URI` in `.env` and `backend/.env`
- `JWT_SECRET` for backend authentication
- `VITE_API_BASE_URL` in `frontend/.env` if backend URL is changed
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` if image upload is needed

4. Install dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

5. Start the backend

```powershell
cd backend
npm run dev
```

Backend default URL: `http://localhost:4000`

6. Start the frontend

```powershell
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5173`

### Option 2: Run with Docker

```powershell
docker compose up --build
```

Default services:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`

### Environment Overview

`/.env`

- `FRONTEND_PORT=8080`
- `BACKEND_PORT=4000`
- `MONGODB_URI=<mongodb-connection-string>`
- `DB_NAME=homelyy`
- `AUTO_SEED=true`
- `JWT_SECRET=<your-secret>`
- `JWT_EXPIRES_IN=7d`

`/backend/.env`

- `NODE_ENV=development`
- `PORT=4000`
- `CLIENT_URL=http://localhost:5173`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173`
- `MONGODB_URI=<mongodb-connection-string>`
- `DB_NAME=homelyy`
- `JWT_SECRET=<your-secret>`
- `JWT_EXPIRES_IN=7d`
- `CLOUDINARY_CLOUD_NAME=<cloud-name>`
- `CLOUDINARY_API_KEY=<api-key>`
- `CLOUDINARY_API_SECRET=<api-secret>`

`/frontend/.env`

- `VITE_API_BASE_URL=http://localhost:4000/api`

## Demo / Accounts / Test Data

### Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| User | `demo@homelyy.local` | `demo1234` |
| Admin | `admin@homelyy.local` | `admin123` |

### Seed Data

If `AUTO_SEED=true`, the backend will automatically seed demo data when starting with an empty database.

Manual seed:

```powershell
cd backend
npm run db:seed
```

## Main Backend Highlights

- JWT-based authentication is used for protected routes, while admin APIs require authenticated requests with the appropriate role.
- Authorization rules are applied to separate public, private, and admin-only endpoints, including safeguards such as preventing invalid admin deletion scenarios.
- The API covers practical commerce flows: cart updates, checkout, order creation, order history, and admin-side order status management.
- Validation rules are defined for key inputs such as email format, password strength, Vietnamese phone number format, quantity, rating, and non-empty order items.
- The backend is organized into models, controllers, services, routes, and middleware, which makes the codebase easier to maintain and review.
- Cloudinary integration is included for product and avatar image upload, and MongoDB seed scripts help prepare demo data quickly.

## API and Project References

- `docs/rest-api.md`
- `docs/database-schema.md`
- `docs/scope-and-flow.md`
- `docs/phase-roadmap.md`
- `deploy.md`

## Scripts

### Backend

- `npm run dev` - run backend with nodemon
- `npm start` - run backend in production mode
- `npm run lint` - run backend lint checks
- `npm run db:seed` - seed demo data

### Frontend

- `npm run dev` - run Vite development server
- `npm run build` - create production build
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks
- `npm run preview` - preview production build

## Future Improvements

- Integrate a real payment gateway such as MoMo UAT or VNPay
- Strengthen stock validation during order creation
- Add tests for critical business flows
- Improve the admin dashboard with richer analytics
- Complete production deployment and error monitoring workflow

## Repository Note

This project is maintained as a portfolio repository to demonstrate practical backend and full-stack implementation skills in a small e-commerce system.
