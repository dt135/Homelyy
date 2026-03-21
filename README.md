# Homelyy

Homelyy là dự án thương mại điện tử full-stack dành cho đồ điện gia dụng, được xây dựng theo hướng portfolio và demo sản phẩm. Dự án tập trung vào trải nghiệm mua sắm rõ ràng, luồng quản trị tương đối đầy đủ, đồng thời bổ sung điều khiển bằng giọng nói để tăng tính trình diễn khi demo hoặc phỏng vấn.

## Mục tiêu dự án

- Xây dựng một ứng dụng e-commerce full-stack có thể chạy được end-to-end.
- Thể hiện khả năng thiết kế giao diện, tổ chức code frontend và xây dựng REST API backend.
- Mô phỏng các luồng nghiệp vụ phổ biến: xác thực, giỏ hàng, đặt hàng, quản trị sản phẩm và người dùng.
- Chuẩn bị sẵn tài liệu, seed dữ liệu và cấu hình triển khai để thuận tiện khi review hoặc demo.

## Tổng quan tính năng

### Khu vực người dùng

- Đăng ký, đăng nhập và cập nhật thông tin hồ sơ.
- Xem trang chủ, danh sách sản phẩm và chi tiết sản phẩm.
- Tìm kiếm, lọc và sắp xếp sản phẩm.
- Thêm sản phẩm vào giỏ hàng và thực hiện checkout.
- Xem lịch sử đơn hàng sau khi đặt mua.
- Điều hướng, tìm kiếm và lọc sản phẩm bằng giọng nói trên frontend.

### Khu vực quản trị

- Xem dashboard thống kê tổng quan.
- Quản lý danh mục sản phẩm.
- Quản lý sản phẩm với các thao tác thêm, sửa, xóa.
- Quản lý đơn hàng và trạng thái xử lý.
- Quản lý người dùng trong hệ thống.
- Upload ảnh sản phẩm và ảnh đại diện thông qua Cloudinary.

## Kiến trúc và công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React 19, TypeScript, React Router, Vite |
| Backend | Node.js, Express, Mongoose, JWT |
| Media Upload | Multer, Cloudinary |
| Database | MongoDB Atlas |
| Triển khai | Docker, Docker Compose, Nginx |

## Cấu trúc thư mục

```text
.
|-- backend/      # API, business logic, model và seed dữ liệu
|-- frontend/     # Giao diện người dùng và trang quản trị
|-- docs/         # Tài liệu phân tích, luồng nghiệp vụ, schema và API
|-- deploy.md     # Ghi chú triển khai
`-- README.md
```

## Tài khoản demo

- Người dùng: `demo@homelyy.local` / `demo1234`
- Quản trị viên: `admin@homelyy.local` / `admin123`

## Hướng dẫn chạy dự án local

### 1. Tạo file môi trường

```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### 2. Cấu hình biến môi trường

Cập nhật tối thiểu các biến sau:

- `MONGODB_URI` trong `.env` và `backend/.env`
- `JWT_SECRET` cho backend
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` nếu cần upload ảnh
- `VITE_API_BASE_URL` trong `frontend/.env` nếu thay đổi cổng backend

### 3. Cài đặt dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 4. Khởi động backend

```powershell
cd backend
npm run dev
```

Backend mặc định chạy tại: `http://localhost:4000`

### 5. Khởi động frontend

```powershell
cd frontend
npm run dev
```

Frontend mặc định chạy tại: `http://localhost:5173`

## Seed dữ liệu mẫu

Nếu `AUTO_SEED=true`, backend sẽ tự động seed dữ liệu khi khởi động với database rỗng.

Bạn cũng có thể seed thủ công:

```powershell
cd backend
npm run db:seed
```

## Chạy bằng Docker

```powershell
docker compose up --build
```

Mặc định:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`

## Biến môi trường chính

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

## Scripts chính

### Backend

- `npm run dev`: chạy backend với nodemon
- `npm start`: chạy backend ở chế độ production
- `npm run lint`: kiểm tra lint backend theo cấu hình hiện tại
- `npm run db:seed`: seed dữ liệu mẫu

### Frontend

- `npm run dev`: chạy Vite development server
- `npm run build`: build production
- `npm run lint`: kiểm tra ESLint
- `npm run typecheck`: kiểm tra TypeScript
- `npm run preview`: preview bản build production

## Luồng nghiệp vụ chính

1. Người dùng duyệt sản phẩm từ trang chủ hoặc trang danh sách.
2. Người dùng tìm kiếm, lọc, xem chi tiết sản phẩm và thêm vào giỏ hàng.
3. Người dùng đăng nhập để thực hiện checkout và tạo đơn hàng.
4. Người dùng theo dõi lịch sử đơn hàng trong tài khoản cá nhân.
5. Quản trị viên đăng nhập để quản lý sản phẩm, danh mục, đơn hàng và người dùng.

## Chất lượng và kiểm tra trước khi deploy

- Kiểm tra kết nối MongoDB thành công.
- Kiểm tra luồng đăng ký và đăng nhập cho cả user và admin.
- Kiểm tra CRUD danh mục, sản phẩm, đơn hàng và người dùng.
- Kiểm tra upload ảnh nếu đã cấu hình Cloudinary.
- Chạy `npm run lint` trong `frontend`.
- Chạy `npm run typecheck` trong `frontend`.
- Build frontend production để xác nhận không có lỗi đóng gói.

## Tài liệu tham khảo trong dự án

- `docs/phase-roadmap.md`
- `docs/scope-and-flow.md`
- `docs/database-schema.md`
- `docs/rest-api.md`

## Định hướng phát triển thêm

- Tích hợp cổng thanh toán thực tế như MoMo UAT hoặc VNPay.
- Bổ sung kiểm tra tồn kho chặt chẽ hơn ở bước đặt hàng.
- Thêm test cho các luồng nghiệp vụ quan trọng.
- Nâng cấp dashboard quản trị với biểu đồ và thống kê chi tiết hơn.
- Hoàn thiện quy trình deploy production và giám sát lỗi.
