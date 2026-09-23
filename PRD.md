# PRD — MarketLink

**Tagline:** Farm Fresh, Just a Click Away
**Category:** End-to-End Web Solution (TechWiz 7, Aptech)

## 1. Problem Statement
Local farmers markets are growing in popularity, but customers rarely know in
advance which Farmers will be at a market on a given day, what stock they
have, or at what price. Availability is communicated informally (chalkboards,
flyers, word of mouth), so customers often arrive to find items sold out or a
Farmer absent. Farmers, in turn, have no easy way to publicize weekly
inventory, take pre-orders, or build relationships with regular customers.

## 2. Proposed Solution
MarketLink is a full-stack web platform connecting local Farmers and
Customers:
- **Farmers** list weekly stock, pricing, and pickup windows, and manage
  incoming pre-orders.
- **Customers** browse nearby markets/farmers, view stock, see locations on a
  map, place pre-orders for pickup, track order history, save favorites, and
  leave reviews.
- **Admin** oversees the platform — farmer approval, customer management,
  market management, content moderation, and reporting.

## 3. Goals
- Reduce wasted customer trips through real-time stock visibility
- Let Farmers efficiently manage inventory and pre-orders
- Provide a centralized, map-based discovery experience

## 4. User Roles

| Role | Core Actions |
|---|---|
| Customer | Register/login, browse markets & farmers, search/filter products, view map, place/track/cancel pre-orders, order history, favorites, reviews & ratings |
| Farmer | Register/login, manage profile & location, manage weekly stock/pricing, manage pre-orders (accept/decline/ready), view order history & sales insights, respond to reviews |
| Admin | Secure login, approve/suspend farmers, activate/deactivate customers, manage markets, content moderation, platform-wide reports, system configuration |

## 5. Explicitly Out of Scope (per SRS, Section 1.5)
- **Payment gateways** — orders are paid for in person at pickup, no online payment.
- **Delivery/courier logistics** — pickup at the market only.
- **Farmer identity/license/organic-certification verification** — not part of the application's functionality.

## 6. Key Features — SRS-Mandatory (must implement all)
- Role-based registration & login (Customer, Farmer, Admin)
- Market & Farmer browsing with map integration (OpenStreetMap + Leaflet.js)
- Product search/filter (category, price, market, day)
- Pre-order flow: cart, pickup slot selection, order status tracking
  (placed → accepted → ready → completed)
- Order cancel/modify before cutoff
- Farmer stock management (add/edit/delete/mark sold-out, recurring weekly
  template)
- Farmer order management + sales insights (total orders, pending orders,
  revenue summary)
- Reviews & ratings (post-order; both farmer and product level)
- Admin dashboard — platform metrics, farmer/customer management, market
  CRUD, content moderation, reports
- Notifications (email/in-app for order confirmation & ready-for-pickup)
- About Us / Contact Us static pages (Contact Us includes a map)
- Privacy Policy / Terms of Service pages, linked from the footer and
  required (via consent checkbox) at registration
- Dark/light mode toggle, accessible from the navbar on every page

## 7. Optional Features (per SRS — only after core is done and tested)
- AI chatbot assistant (market timings, Farmer availability, pickup windows,
  product details)
- Family account sharing for customers (SRS marks this optional)

## 8. Success Criteria
- All SRS-mandatory functional requirements work end-to-end
- Clean, navigable UI — dark mode + font-size accessibility toggle
- Documented, justifiable code — every dev can explain their own module
- Complete deliverables: README, DB schema/SQL or schema file, credentials
  for all roles, demo video, sitemap

## 9. Tech Stack (locked in TRD)
- Frontend: React (Vite) + Tailwind + shadcn/ui
- Backend: Node.js + Express.js
- Database: MongoDB
- Maps: OpenStreetMap + Leaflet.js
- Auth: JWT-based, role middleware