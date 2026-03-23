# Homelyy

Homelyy là dự án thương mại điện tử full-stack cho lĩnh vực đồ điện gia dụng, được xây dựng theo hướng portfolio với luồng mua hàng và quản trị chạy end-to-end.  
Dự án tập trung vào các bài toán backend thực tế như authentication, role-based access control, validation, quản lý sản phẩm và đơn hàng, upload media, cùng cấu hình sẵn sàng cho triển khai.  
Mục tiêu là thể hiện nhiều hơn một project CRUD cơ bản thông qua các luồng nghiệp vụ cốt lõi của một hệ thống commerce quy mô nhỏ.

## Mô Tả Ngắn

Homelyy mô phỏng đầy đủ luồng mua sắm trực tuyến: duyệt sản phẩm, tìm kiếm và lọc, giỏ hàng, checkout, lịch sử đơn hàng và thao tác quản trị.  
Ở phía backend, dự án cung cấp REST API với JWT authentication, endpoint phân quyền cho admin, các quy tắc validation, mô hình dữ liệu MongoDB, seed data và tích hợp Cloudinary để upload ảnh.  
Repository cũng đi kèm tài liệu triển khai, tài liệu API và thiết kế cơ sở dữ liệu để thuận tiện cho việc review, demo và chạy thử local.

## Tính Năng Chính

### Tính Năng Người Dùng

- Đăng ký, đăng nhập và cập nhật thông tin hồ sơ
- Duyệt danh sách sản phẩm, xem chi tiết sản phẩm và trang catalog nổi bật
- Tìm kiếm, lọc và sắp xếp sản phẩm
- Thêm sản phẩm vào giỏ hàng và thực hiện checkout
- Xem lịch sử đơn hàng cá nhân sau khi mua
- Điều hướng, tìm kiếm và lọc sản phẩm bằng giọng nói ở frontend

### Tính Năng Quản Trị

- Truy cập dashboard quản trị riêng
- Quản lý danh mục và sản phẩm
- Quản lý đơn hàng và cập nhật trạng thái xử lý
- Quản lý người dùng với quyền admin
- Upload ảnh sản phẩm và ảnh đại diện qua Cloudinary

### Năng Lực Backend

- REST API được tổ chức theo từng nhóm chức năng
- JWT authentication cho các route bảo vệ
- Role-based authorization cho các endpoint admin
- Validation cho email, mật khẩu, số điện thoại, số lượng, rating và payload đơn hàng
- Mô hình dữ liệu MongoDB cho users, products, categories, carts, orders và reviews
- Cơ chế seed dữ liệu để hỗ trợ review và chạy demo nhanh

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

### Tích Hợp

- Cloudinary
- Multer

## Cấu Trúc Dự Án

```text
.
|-- backend/      # Express API, business logic, models, middleware, seed data
|-- frontend/     # Giao diện người dùng và trang quản trị
|-- docs/         # Scope, API design, database schema, roadmap
|-- deploy.md     # Ghi chú triển khai
`-- README.md
```

Phần backend được tách thành controllers, services, models, routes, middlewares, utilities và seed scripts. Cách tổ chức này giúp luồng xử lý request, business logic và dữ liệu rõ ràng hơn, đồng thời thuận tiện cho việc mở rộng.

## Cài Đặt Và Chạy Local

### Cách 1: Chạy Thủ Công

1. Clone repository

```powershell
git clone <your-repository-url>
cd Homelyy
```

2. Tạo file môi trường

```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

3. Cấu hình các biến môi trường cần thiết

Tối thiểu cần chuẩn bị:

- `MONGODB_URI` trong `.env` và `backend/.env`
- `JWT_SECRET` cho xác thực backend
- `VITE_API_BASE_URL` trong `frontend/.env` nếu thay đổi URL backend
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` nếu cần upload ảnh

4. Cài đặt dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

5. Khởi động backend

```powershell
cd backend
npm run dev
```

Backend mặc định chạy tại: `http://localhost:4000`

6. Khởi động frontend

```powershell
cd frontend
npm run dev
```

Frontend mặc định chạy tại: `http://localhost:5173`

### Cách 2: Chạy Bằng Docker

```powershell
docker compose up --build
```

Mặc định:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`

### Tổng Quan Biến Môi Trường

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

## Demo / Tài Khoản / Dữ Liệu Mẫu

### Tài Khoản Demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| User | `demo@homelyy.local` | `demo1234` |
| Admin | `admin@homelyy.local` | `admin123` |

### Seed Data

Nếu `AUTO_SEED=true`, backend sẽ tự động seed dữ liệu demo khi khởi động với database trống.

Seed thủ công:

```powershell
cd backend
npm run db:seed
```

## Điểm Nổi Bật Về Backend

- Sử dụng JWT authentication cho các route cần bảo vệ, đồng thời yêu cầu quyền phù hợp đối với các API admin.
- Áp dụng authorization để tách rõ public, private và admin-only endpoints, bao gồm một số ràng buộc an toàn cho thao tác quản trị người dùng.
- API bao phủ các luồng nghiệp vụ commerce quan trọng như cập nhật giỏ hàng, checkout, tạo đơn hàng, xem lịch sử đơn hàng và quản lý trạng thái đơn từ phía admin.
- Validation được định nghĩa cho các đầu vào quan trọng như định dạng email, độ mạnh mật khẩu, số điện thoại Việt Nam, số lượng, rating và đơn hàng không được rỗng.
- Backend được tổ chức theo models, controllers, services, routes và middleware, giúp codebase dễ bảo trì và dễ review hơn.
- Tích hợp Cloudinary cho upload ảnh sản phẩm và ảnh đại diện, đồng thời có seed script MongoDB để chuẩn bị dữ liệu demo nhanh.

## Tài Liệu Tham Khảo

- `docs/rest-api.md`
- `docs/database-schema.md`
- `docs/scope-and-flow.md`
- `docs/phase-roadmap.md`
- `deploy.md`

## Scripts

### Backend

- `npm run dev` - chạy backend với nodemon
- `npm start` - chạy backend ở chế độ production
- `npm run lint` - kiểm tra lint backend
- `npm run db:seed` - seed dữ liệu demo

### Frontend

- `npm run dev` - chạy Vite development server
- `npm run build` - build production
- `npm run lint` - chạy ESLint
- `npm run typecheck` - kiểm tra TypeScript
- `npm run preview` - preview bản build production

## Hướng Phát Triển Thêm

- Tích hợp cổng thanh toán thực tế như MoMo UAT hoặc VNPay
- Tăng cường kiểm tra tồn kho ở bước tạo đơn hàng
- Bổ sung test cho các luồng nghiệp vụ quan trọng
- Nâng cấp dashboard quản trị với thống kê chi tiết hơn
- Hoàn thiện quy trình deploy production và theo dõi lỗi

## Ghi Chú Repository

Dự án này được duy trì như một portfolio repository nhằm thể hiện năng lực triển khai backend và full-stack trong bối cảnh một hệ thống thương mại điện tử quy mô nhỏ.
