# Homelyy

Homelyy la du an full-stack e-commerce do dien gia dung, duoc xay dung theo huong portfolio/demo san pham. Du an tap trung vao trai nghiem mua sam ro rang, luong quan tri day du, va bo sung voice control de tang tinh trinh dien khi demo.

## Tong quan

- Frontend cho khach hang va trang quan tri duoc xay dung voi React + TypeScript.
- Backend cung cap REST API cho xac thuc, san pham, gio hang, don hang, nguoi dung va media.
- MongoDB duoc dung de luu tru du lieu, Cloudinary duoc dung cho upload hinh anh.
- Ho tro chay local va docker compose de phuc vu phat trien va deploy demo.

## Tinh nang noi bat

### Nguoi dung
- Dang ky, dang nhap va cap nhat ho so.
- Xem danh sach san pham, chi tiet san pham va tim kiem.
- Them vao gio hang, checkout va xem lich su don hang.
- Dieu huong, tim kiem va loc san pham bang giong noi tren frontend.

### Quan tri
- Dashboard thong ke tong quan.
- CRUD danh muc va san pham.
- Quan ly don hang va nguoi dung.
- Upload avatar va hinh san pham thong qua Cloudinary.

## Cong nghe su dung

| Layer | Cong nghe |
| --- | --- |
| Frontend | React 19, TypeScript, React Router, Vite |
| Backend | Node.js, Express, Mongoose, JWT, Multer |
| Media | Cloudinary |
| Database | MongoDB Atlas |
| Deploy | Docker, Docker Compose, Nginx |

## Cau truc thu muc

```text
.
|-- backend/    # REST API va xu ly du lieu
|-- frontend/   # Giao dien nguoi dung va admin
|-- docs/       # Tai lieu phan tich, schema va API
|-- deploy.md   # Ghi chu deploy
`-- README.md
```

## Tai khoan demo

- User: `demo@homelyy.local` / `demo1234`
- Admin: `admin@homelyy.local` / `admin123`

## Chay du an local

### 1. Tao file moi truong

```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### 2. Cau hinh bien moi truong

Cap nhat toi thieu cac bien sau:

- `MONGODB_URI` trong `.env` va `backend/.env`
- `JWT_SECRET` cho backend
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` neu can upload anh
- `VITE_API_BASE_URL` trong `frontend/.env` neu thay doi cong backend

### 3. Cai dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 4. Khoi dong backend

```powershell
cd backend
npm run dev
```

Backend mac dinh: `http://localhost:4000`

### 5. Khoi dong frontend

```powershell
cd frontend
npm run dev
```

Frontend mac dinh: `http://localhost:5173`

## Seed du lieu

Neu `AUTO_SEED=true`, backend se tu dong seed du lieu mau khi khoi dong voi database rong.

Ban cung co the seed thu cong:

```powershell
cd backend
npm run db:seed
```

## Chay bang Docker

```powershell
docker compose up --build
```

Mac dinh:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`

## Bien moi truong chinh

### Root `.env`

- `FRONTEND_PORT=8080`
- `BACKEND_PORT=4000`
- `MONGODB_URI=<mongodb-connection-string>`
- `DB_NAME=homelyy`
- `AUTO_SEED=true`
- `JWT_SECRET=<your-secret>`
- `JWT_EXPIRES_IN=7d`

### `backend/.env`

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

### `frontend/.env`

- `VITE_API_BASE_URL=http://localhost:4000/api`

## Scripts chinh

### Backend

- `npm run dev`: chay backend voi nodemon
- `npm start`: chay backend o che do production
- `npm run db:seed`: seed du lieu mau

### Frontend

- `npm run dev`: chay Vite dev server
- `npm run build`: build production
- `npm run lint`: kiem tra lint
- `npm run typecheck`: kiem tra TypeScript

## Checklist truoc khi push/deploy

- Kiem tra ket noi MongoDB thanh cong.
- Kiem tra luong dang nhap user/admin.
- Kiem tra CRUD san pham va don hang.
- Kiem tra upload anh neu da cau hinh Cloudinary.
- Chay `npm run lint` trong `frontend`.
- Chay `npm run typecheck` trong `frontend`.

## Tai lieu tham khao

- `docs/phase-roadmap.md`
- `docs/scope-and-flow.md`
- `docs/database-schema.md`
- `docs/rest-api.md`
