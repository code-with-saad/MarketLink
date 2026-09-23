# TRD — MarketLink

Technical reference for all devs (and AI tools) working on this repo. Do not
change the schema or route contracts listed here without team agreement —
other modules depend on them.

## 1. Tech Stack
- Frontend: React (Vite) + Tailwind + shadcn/ui
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose ODM)
- Auth: JWT (access token in header)
- Maps: OpenStreetMap tiles + Leaflet.js (no API key/billing required)
- HTTP: Axios (all API calls, every module)
- State management: Redux Toolkit (locked — do not use Context alongside it,
  pick one and Redux is it)

## 2. Repo / Folder Structure

```
marketlink/
├── client/                # React app
│   ├── src/
│   │   ├── api/           # axios instances, one file per module (farmerApi.js, customerApi.js, adminApi.js, authApi.js)
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── customer/
│   │   │   ├── farmer/
│   │   │   └── admin/
│   │   ├── context/        # AuthContext etc.
│   │   └── App.jsx
├── server/
│   ├── models/             # Mongoose schemas (one file per entity)
│   ├── routes/              # one file per module: authRoutes.js, farmerRoutes.js, customerRoutes.js, adminRoutes.js
│   ├── controllers/         # matching controller per route file
│   ├── middleware/          # authMiddleware.js (verifyToken + role check)
│   ├── config/               # db connection
│   └── server.js
├── README.md
├── PRD.md
├── TRD.md
├── progress.md
└── .env.example
```

Each dev works inside their own route/controller/pages files — do not edit
another dev's files directly; open a PR instead.

## 3. Database Schema (locked)

### User
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK |
| name | String | |
| email | String | unique |
| password_hash | String | |
| role | Enum | `customer`, `farmer`, `admin` |
| contact_number | String | |
| address | String | |
| status | Enum | `pending`, `active`, `suspended`. Farmer default = `pending` (admin must approve before the farmer can list products). Customer/admin default = `active`. Admin controls suspend/approve. |
| otp_code | String | optional — 6-digit code for forgot-password flow |
| otp_expires_at | Date | optional |
| otp_resend_count | Number | optional — resets per forgot-password session; max 3 resends enforced |
| otp_last_sent_at | Date | optional — used to enforce 1-minute cooldown between resends |
| created_at | Date | |

### Auth policy notes (locked)
- JWT expiry: access token expires in 2 hours. On expiry the frontend
  clears local auth state and redirects to login — this is normal
  behavior, not a bug.
- Admin accounts are never created via public `/register` — only via the
  `seedAdmin.js` script. The register form and the register API route both
  reject role `admin`.
- Forgot-password OTP: max 3 resends per reset attempt, 1-minute cooldown
  between each resend (so a full resend cycle takes ~3 minutes before the
  user must restart the flow).
- Registration requires accepting Privacy Policy + Terms of Service via a
  required checkbox — enforced both in the UI (submit disabled until
  checked) and the backend (reject if not sent as true).

### FarmerProfile
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK |
| user_id | ObjectId (FK → User) | |
| stall_name | String | |
| markets | [ObjectId] (FK → Market) | markets this farmer sells at |
| operating_days | [String] | |
| pickup_windows | String | |
| latitude | Number | |
| longitude | Number | |

### Market
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK |
| market_name | String | |
| address | String | |
| latitude | Number | |
| longitude | Number | |
| operating_days | [String] | |
| timings | String | |

### Product
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK |
| farmer_id | ObjectId (FK → User) | |
| name | String | |
| category | String | vegetables, fruits, dairy, baked goods, etc. |
| price | Number | |
| unit | String | |
| quantity_available | Number | |
| description | String | |
| image_url | String | |
| is_sold_out | Boolean | |

### Order
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK |
| customer_id | ObjectId (FK → User) | |
| farmer_id | ObjectId (FK → User) | |
| items | [{ product_id, quantity, price_at_order }] | |
| total_amount | Number | |
| status | Enum | `placed`, `accepted`, `ready`, `completed`, `cancelled` |
| pickup_date | Date | |
| pickup_slot | String | |
| cutoff_time | Date | calculated at order-placement time from the farmer's pickup slot config (e.g. slot start − 2 hrs). Cancel/modify only allowed while `now < cutoff_time`. Stored per-order (not read live from farmer profile) so later farmer setting changes don't retroactively affect existing orders. |
| created_at | Date | |

### Review
Locked decision: a review targets EITHER a farmer OR a product, not
necessarily both — customer can leave a farmer-level review (overall stall
experience) and/or separate product-level reviews independently.

| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK |
| customer_id | ObjectId (FK → User) | |
| farmer_id | ObjectId (FK → User) | required |
| product_id | ObjectId (FK → Product) | optional — null means this is a farmer-level review, not tied to one product |
| rating | Number | 1–5 |
| comment | String | |
| farmer_response | String | optional |
| created_at | Date | |

### Favorite
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK |
| customer_id | ObjectId (FK → User) | |
| farmer_id | ObjectId | optional |
| product_id | ObjectId | optional |

## 4. Auth & Role Middleware
- `POST /api/auth/register` — body includes `role`; validates role-specific
  required fields (farmer needs stall_name, customer needs address, etc.)
- `POST /api/auth/login` — returns JWT with `{ user_id, role }` in payload
- `middleware/verifyToken` — attaches `req.user`
- `middleware/requireRole(role)` — used per route, e.g.
  `requireRole('farmer')` on all farmer routes

All other modules import `verifyToken` + `requireRole` from
`middleware/authMiddleware.js`. Do not write a second auth system.

## 5. API Routes by Module

### Auth (`/api/auth`) — Dev 1
- `POST /register`
- `POST /login`
- `GET /me`

### Farmer (`/api/farmer`) — Dev 2
- `GET /profile` / `PUT /profile`
- `GET /products` / `POST /products` / `PUT /products/:id` / `DELETE /products/:id`
- `GET /orders` / `PUT /orders/:id/status`
- `GET /insights` (total orders, pending, revenue)
- `GET /reviews` / `POST /reviews/:id/respond`

### Customer (`/api/customer`) — Dev 3
- `GET /markets` / `GET /markets/:id/farmers`
- `GET /products` (search/filter query params: category, price, market, day)
- `POST /orders` / `GET /orders` / `PUT /orders/:id/cancel`
- `POST /favorites` / `GET /favorites`
- `POST /reviews`

### Admin (`/api/admin`) — Dev 4
- `GET /dashboard` (metrics)
- `GET /farmers` / `PUT /farmers/:id/approve` / `PUT /farmers/:id/suspend`
- `GET /customers` / `PUT /customers/:id/status`
- `GET /markets` / `POST /markets` / `PUT /markets/:id` / `DELETE /markets/:id`
- `DELETE /reviews/:id` / `DELETE /products/:id` (moderation)
- `GET /reports`

## 6. Git Workflow
- `main` branch protected — no direct pushes
- Branch naming: `dev1/auth-setup`, `dev2/farmer-stock`, etc.
- One PR per feature, reviewed by lead (Dev 1) before merge
- Schema/model changes require a message in the team group before pushing —
  not a silent PR

## 7. Order Status Flow (cross-module, test this explicitly on Day 3)
```
placed (customer creates)
  → accepted (farmer action)
  → ready (farmer action)
  → completed (farmer marks after pickup)
  → cancelled (customer action, only allowed before farmer's cutoff time)
```

## 8. Cross-Cutting Requirements (apply to every phase, not a separate module)
These are easy to forget when building one module at a time — check every
new page/form against this list before calling a phase done.

- **Password fields**: every password input has a show/hide eye-icon toggle
- **Theme**: dark/light mode toggle in the navbar, persisted (localStorage),
  applied via Tailwind's `dark:` classes
- **Session persistence**: on page load/refresh, if a token exists, call
  `/api/auth/me` to rehydrate Redux auth state before rendering protected
  routes — don't rely on Redux state alone (it resets on refresh)
- **Route guards**: protected routes redirect unauthenticated users to
  `/login`. Conversely, an authenticated user landing on `/login` or
  `/register` (including via browser back button) should be redirected
  forward to their dashboard, not shown the auth form again
- **Logout**: clears token + Redux state + any persisted storage, redirects
  to home
- **Input validation**: both frontend (inline errors, don't just rely on
  HTML5 `required`) and backend (reject invalid payloads with clear 400
  errors) — every form, not just auth
- **Rate limiting**: applied to all auth routes (login, register,
  forgot-password, resend-otp) to prevent brute force / spam
- **Error handling**: consistent JSON error shape from the backend
  (`{ success: false, message: "..." }`), a global Express error handler,
  and a frontend 404/not-found page for unmatched routes
- **Footer/nav links**: every link either goes to a real built page or is
  visibly disabled/hidden — never a dead `href="#"` with no behavior
- **Legal pages**: `/privacy-policy` and `/terms-of-service` exist as real
  pages (static content is fine), linked from the footer and from the
  registration consent checkbox
- **No leftover dev/preview UI**: style-guide or design-system preview
  blocks (used to sanity-check the design system while building it) must
  be removed from real pages before a phase is marked done

## 9. Maps Integration Notes
- Use Leaflet.js + OpenStreetMap tile layer — no API key needed
- Store `latitude`/`longitude` on both `Market` and `FarmerProfile`
- Fallback if map integration is not working by Day 3 evening: render a
  plain address list instead of the map component — do not let this block
  other features