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
- Query: `search`, `category`, `brand`, `minPrice`, `maxPrice`, `sort`

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

### GET `/admin/dashboard` (admin)

### GET `/admin/products` (admin)

### GET `/admin/orders` (admin)

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
