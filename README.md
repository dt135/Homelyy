# Homelyy

Homelyy là dự án fullstack portfolio cho website bán đồ điện gia dụng, tập trung vào trải nghiệm mua hàng rõ ràng và dễ dùng.

## Tính năng chính
- Frontend React: trang chủ, danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng, checkout.
- Xác thực và phân quyền: đăng nhập, đăng ký, profile, lịch sử đơn hàng, route admin.
- Voice Control: điều hướng, tìm kiếm và lọc sản phẩm bằng giọng nói.

## Tech stack
- Frontend: React 19, TypeScript, React Router, Context API, Vite.
- Backend: Node.js, Express, Mongoose, dotenv, CORS, morgan.
- Deploy: Docker, docker-compose, Nginx.

## Chạy local

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Chạy bằng Docker
```bash
docker compose up --build
```

## Biến môi trường
- Frontend: sao chép `frontend/.env.example` thành `frontend/.env`
- Backend: sao chép `backend/.env.example` thành `backend/.env`

### Kết nối API
- Trong `frontend/.env`, giữ:
  - `VITE_API_BASE_URL=http://localhost:4000/api`

### MongoDB Atlas
- Dự án backend đã chuyển sang MongoDB Atlas bằng `mongoose`.
- Cập nhật `MONGODB_URI` trong `backend/.env`:
  - `mongodb+srv://<db_user>:<db_password>@<cluster-host>/?appName=Homelyy`
- Thay `<db_password>` bằng mật khẩu user Atlas của bạn.
- Cấu hình JWT trong `backend/.env`:
  - `JWT_SECRET=...`
  - `JWT_EXPIRES_IN=7d`
- Nếu muốn nạp dữ liệu mẫu thủ công:
```bash
cd backend
npm run db:seed
```

## Tài liệu kỹ thuật
- `docs/phase-roadmap.md`
- `docs/scope-and-flow.md`
- `docs/database-schema.md`
- `docs/rest-api.md`
