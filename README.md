# Homelyy

Homelyy la du an portfolio full-stack cho website thuong mai dien tu do dien gia dung. Du an tap trung vao trai nghiem mua hang ro rang, de dung, va co them Voice Control de tao diem nhan khi demo.

## Tinh nang chinh
- Khach hang: dang ky, dang nhap, xem danh sach san pham, xem chi tiet, them vao gio hang, checkout, xem lich su don hang, cap nhat ho so.
- Quan tri: dashboard thong ke, CRUD danh muc, CRUD san pham, quan ly don hang, quan ly nguoi dung.
- Upload media: avatar nguoi dung va anh san pham qua Cloudinary.
- Voice Control: dieu huong, tim kiem, va loc san pham bang giong noi tren frontend.

## Tech stack
- Frontend: React 19, TypeScript, React Router, Context API, Vite.
- Backend: Node.js, Express, Mongoose, JWT, Cloudinary, Multer.
- Database: MongoDB Atlas.
- Deploy: Docker, docker-compose, Nginx.

## Demo accounts
- User demo: `demo@homelyy.local` / `demo1234`
- Admin demo: `admin@homelyy.local` / `admin123`

## Chay local
1. Tao file moi truong:
```bash
copy .env.example .env
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```
2. Cap nhat `MONGODB_URI` trong `backend/.env` va `.env`.
3. Cai dependencies:
```bash
cd backend
npm install

cd ..\frontend
npm install
```
4. Chay backend:
```bash
cd backend
npm run dev
```
5. Chay frontend:
```bash
cd frontend
npm run dev
```

Frontend mac dinh chay tai `http://localhost:5173`.
Backend mac dinh chay tai `http://localhost:4000`.

## Seed du lieu
Neu `AUTO_SEED=true`, backend se tu nap du lieu mau khi khoi dong voi database rong.

Ban cung co the seed thu cong:
```bash
cd backend
npm run db:seed
```

## Chay bang Docker
```bash
docker compose up --build
```

Mac dinh:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`

## Bien moi truong
### Root `.env`
- `FRONTEND_PORT=8080`
- `BACKEND_PORT=4000`
- `MONGODB_URI=...`
- `DB_NAME=homelyy`
- `AUTO_SEED=true`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`

### Backend `backend/.env`
- `NODE_ENV=development`
- `PORT=4000`
- `CLIENT_URL=http://localhost:5173`
- `MONGODB_URI=...`
- `DB_NAME=homelyy`
- `AUTO_SEED=true`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`

### Frontend `frontend/.env`
- `VITE_API_BASE_URL=http://localhost:4000/api`

## Kiem tra nhanh truoc khi deploy
- Dang nhap user demo va tao duoc don hang.
- Dang nhap admin demo va vao duoc dashboard.
- CRUD san pham hoat dong.
- Upload anh san pham hoat dong neu da cau hinh Cloudinary.
- `npm run lint` trong `frontend` pass.
- `npm run typecheck` trong `frontend` pass.

## Tai lieu ky thuat
- `docs/phase-roadmap.md`
- `docs/scope-and-flow.md`
- `docs/database-schema.md`
- `docs/rest-api.md`
