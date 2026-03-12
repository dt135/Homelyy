# Homelyy REST API Design

Base URL: `/api`

## Auth

### POST `/auth/login` (public, MVP)
- Body:
```json
{ "email": "demo@homelyy.local", "password": "123456" }
```
- Response:
```json
{ "message": "Login success", "data": { "id": "user-1", "fullName": "Demo User", "email": "demo@homelyy.local", "role": "user" } }
```

### POST `/auth/register` (public, MVP)
- Body:
```json
{ "fullName": "New User", "email": "new@homelyy.local", "password": "123456" }
```

## Products

### GET `/products` (public, MVP)
- Query: `search`, `category`, `brand`, `minPrice`, `maxPrice`, `sort`, `featured`, `new`, `limit`

### GET `/products/:id` (public, MVP)
- Product detail for product page.

## Categories

### GET `/categories` (public, MVP)

## Cart

### GET `/cart?userId=user-1` (private, MVP)

### PUT `/cart` (private, MVP)
- Body:
```json
{ "userId": "user-1", "items": [{ "productId": "af-510", "quantity": 1 }] }
```

## Orders

### GET `/orders?userId=user-1` (private, MVP)

### POST `/orders` (private, MVP)
- Body:
```json
{
  "userId": "user-1",
  "items": [{ "productId": "af-510", "quantity": 1, "price": 2590000 }],
  "paymentMethod": "cod",
  "shippingAddress": {
    "fullName": "Demo User",
    "phone": "0900000001",
    "city": "HCM",
    "district": "District 7",
    "addressLine": "123 Nguyen Van Linh"
  }
}
```

## Users

### GET `/users` (admin)

### GET `/users/:id` (private/admin)

### PATCH `/users/:id` (private, MVP)

## Reviews

### GET `/reviews?productId=af-510` (public)

### POST `/reviews` (private)

## Admin

Tất cả endpoint admin yêu cầu header:
```text
Authorization: Bearer <jwt_token>
```

### GET `/admin/dashboard` (admin)

### GET `/admin/categories` (admin)
- Lấy danh sách danh mục để quản trị.

### POST `/admin/categories` (admin)
- Body: `{ "id": "cat-tu-chon", "name": "Tên danh mục" }`
- `id` là tùy chọn, nếu bỏ qua server sẽ tự sinh.

### PATCH `/admin/categories/:id` (admin)
- Body: `{ "name": "Tên danh mục mới" }`
- Khi đổi tên danh mục, các sản phẩm đang dùng tên cũ sẽ được đồng bộ sang tên mới.

### DELETE `/admin/categories/:id` (admin)
- Chỉ xóa được khi danh mục không còn sản phẩm liên kết.

### GET `/admin/products` (admin)

### POST `/admin/products` (admin)
- Body: tạo mới sản phẩm với các trường chính `name`, `description`, `category`, `brand`, `price`, `stock`, `thumbnail`.

### PATCH `/admin/products/:id` (admin)
- Cập nhật thông tin sản phẩm theo `id`.

### DELETE `/admin/products/:id` (admin)
- Xóa sản phẩm theo `id`.

### GET `/admin/orders` (admin)

### PATCH `/admin/orders/:id` (admin)
- Cập nhật trạng thái đơn hàng (`pending`, `processing`, `completed`) hoặc phương thức thanh toán.

### DELETE `/admin/orders/:id` (admin)
- Xóa đơn hàng theo `id`.

## Validation priorities
- `email` must be valid format.
- `password` min length 6.
- `quantity` >= 1.
- `rating` in range 1..5.
- `order.items` cannot be empty.

## Business rules
- Only authenticated users can checkout.
- Non-admin cannot access admin endpoints.
- Product stock must be checked before confirming orders (real backend phase).
