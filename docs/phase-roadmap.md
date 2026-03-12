# Homelyy Roadmap

## Phase 1 - Direction and architecture
- Final stack: React + TypeScript + React Router + Context API + mock API service layer + Express backend.
- Core constraints: feature-based folder structure, module isolation, easy swap from mock API to real API.
- MVP focus: product browsing, cart, auth, checkout, profile, order history.

## Phase 2 - Frontend feature implementation (MVP)
- Build reusable layout and route system.
- Implement HomePage with production-like sections.
- Implement Product Listing with search, filter, sort, and loading/error/empty states.
- Implement Product Detail with specs, related products, and add-to-cart.
- Implement Cart, Checkout, Auth, Profile, Order History, and admin base pages.

## Phase 3 - Voice Control highlight
- Add Web Speech API based command listener.
- Parse navigation/search/filter commands.
- Execute command actions through React Router.
- Show user feedback and supported command list.

## Phase 4 - Data and backend
- Build mock data + mock service architecture for frontend.
- Define database schema and REST API contract.
- Build Express backend base with route/controller/service layers.

## Phase 5 - Deployment and finishing
- Add Dockerfile for frontend and backend.
- Add docker-compose for full local stack.
- Add technical README and environment templates.
- Keep architecture docs for review and portfolio presentation.
