# Scope and User Flow

## MVP Feature Scope
- Guest: view home, browse products, search/filter/sort, view product detail.
- Authenticated user: login/register, cart, checkout, profile update, order history.
- Admin: dashboard, product list management view, order management view.
- Voice control: navigate pages, search query, category/price filter, go back.

## Advanced Scope
- Wishlist, review moderation, real payment integration, shipment tracking.
- Analytics dashboard and inventory alerts.

## Main user flows
1. Product discovery: Home -> Product Listing -> Product Detail -> Add to cart.
2. Search and filter: Product Listing -> search/filter/sort -> product detail.
3. Checkout: Cart -> Checkout form -> Order success -> Order history.
4. Auth: Login/Register -> Protected pages (profile, checkout, orders).
5. Admin: Admin dashboard -> product and order management pages.
6. Voice flow: start mic -> speech-to-text -> parse command -> execute route/filter action.

## Common UX risk points
- Missing loading/empty/error states on data calls.
- Losing filters when navigating back.
- Checkout form validation not clear enough.
- Voice recognition unsupported in some browsers.
