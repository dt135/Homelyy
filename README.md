# Homelyy

Homelyy là dự án fullstack portfolio cho website bán đồ điện gia dụng, tập trung vào trải nghiệm mua hàng rõ ràng và dễ dùng.

## Tính năng chính
- Frontend React: trang chủ, danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng, checkout.
- Xác thực và phân quyền: đăng nhập, đăng ký, profile, lịch sử đơn hàng, route admin.
- Voice Control: điều hướng, tìm kiếm và lọc sản phẩm bằng giọng nói.
- Mock API có thể chuyển sang backend thật qua biến môi trường.

## Tech stack
- Frontend: React 19, TypeScript, React Router, Context API, Vite.
- Backend: Node.js, Express, dotenv, CORS, morgan.
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

## Tài liệu kỹ thuật
- `docs/phase-roadmap.md`
- `docs/scope-and-flow.md`
- `docs/database-schema.md`
- `docs/rest-api.md`
