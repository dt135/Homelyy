# Homelyy Database Schema (Simple and Practical)

## User
| Field | Type | Required (MVP) | Notes |
|---|---|---|---|
| id | string/uuid | yes | primary key |
| fullName | string | yes | display name |
| email | string | yes | unique |
| passwordHash | string | yes | store hash only |
| role | enum(user,admin) | yes | authorization |
| phone | string | optional | profile update |
| createdAt | datetime | yes | audit |

## Category
| Field | Type | Required (MVP) | Notes |
|---|---|---|---|
| id | string/uuid | yes | primary key |
| name | string | yes | unique category name |
| slug | string | yes | SEO-friendly |

## Product
| Field | Type | Required (MVP) | Notes |
|---|---|---|---|
| id | string/uuid | yes | primary key |
| name | string | yes | product title |
| slug | string | yes | SEO-friendly |
| categoryId | string | yes | FK -> Category |
| brand | string | yes | basic filter |
| price | number | yes | selling price |
| oldPrice | number | optional | discount display |
| rating | number | optional | average rating |
| stock | number | yes | inventory |
| description | text | yes | detail page |
| specsJson | json | optional | technical specs |
| createdAt | datetime | yes | sorting |

## Cart + CartItem
| Field | Type | Required (MVP) | Notes |
|---|---|---|---|
| cart.id | string/uuid | yes | primary key |
| cart.userId | string | yes | FK -> User |
| cartItem.id | string/uuid | yes | primary key |
| cartItem.cartId | string | yes | FK -> Cart |
| cartItem.productId | string | yes | FK -> Product |
| cartItem.quantity | number | yes | >=1 |

## Order + OrderItem
| Field | Type | Required (MVP) | Notes |
|---|---|---|---|
| order.id | string/uuid | yes | primary key |
| order.userId | string | yes | FK -> User |
| order.status | enum | yes | pending/processing/completed |
| order.paymentMethod | enum | yes | cod/banking |
| order.totalAmount | number | yes | final amount |
| order.createdAt | datetime | yes | timeline |
| orderItem.id | string/uuid | yes | primary key |
| orderItem.orderId | string | yes | FK -> Order |
| orderItem.productId | string | yes | FK -> Product |
| orderItem.quantity | number | yes | >=1 |
| orderItem.unitPrice | number | yes | snapshot price |

## Review
| Field | Type | Required (MVP) | Notes |
|---|---|---|---|
| id | string/uuid | yes | primary key |
| userId | string | yes | FK -> User |
| productId | string | yes | FK -> Product |
| rating | number | yes | 1..5 |
| comment | text | optional | review text |
| createdAt | datetime | yes | audit |

## Optional Advanced Entities
- Wishlist: `id`, `userId`, `productId`, `createdAt`.
- Address: reusable saved addresses per user for faster checkout.

## Main Relationships
- User 1-n Order
- User 1-1 Cart
- Cart 1-n CartItem
- Order 1-n OrderItem
- Category 1-n Product
- Product 1-n Review
