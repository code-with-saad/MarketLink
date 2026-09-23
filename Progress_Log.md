# MarketLink — Progress Log

---

## [2026-09-23] [Phase 0] [COMPLETE] — Project skeleton built

### What was completed

**Server (`server/`)**
- `package.json` — express, mongoose, jsonwebtoken, bcrypt, dotenv, cors, nodemon (dev)
- `server.js` — Express app with CORS, JSON middleware, all 4 route mounts, health-check endpoint; runs on `npm run dev`
- `config/db.js` — Mongoose connection reading `MONGO_URI` from `.env`; exits cleanly on failure
- **7 Mongoose models** (exact TRD schema, field names, enums):
  - `User` — role/status enums
  - `FarmerProfile` — refs User & Market, lat/lng
  - `Market` — operating_days, timings, lat/lng
  - `Product` — farmer_id → User, category, is_sold_out
  - `Order` — embedded items `[{product_id, quantity, price_at_order}]`, status enum, `cutoff_time` stored per-order
  - `Review` — `product_id` optional (null = farmer-level review), `farmer_response` optional
  - `Favorite` — farmer_id and product_id both optional
- **4 route files** (all routes from TRD Section 5 wired up, protected by verifyToken + requireRole):
  - `authRoutes.js`, `farmerRoutes.js`, `customerRoutes.js`, `adminRoutes.js`
- **4 controller files** (all handlers stubbed, 501 Not Implemented, with TODO comments):
  - `authController.js`, `farmerController.js`, `customerController.js`, `adminController.js`
- `middleware/authMiddleware.js` — `verifyToken` (attaches `req.user`) + `requireRole(role)`

**Client (`client/`)**
- Vite + React scaffold
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **shadcn/ui** initialized (components.json, `src/lib/utils.js`, `src/components/ui/button.jsx`)
- `jsconfig.json` with `@` → `./src/*` alias
- **Redux Toolkit** — `store/store.js` + `store/slices/authSlice.js` (setCredentials, logout, selectors)
- **Axios** — `src/api/axiosInstance.js` (baseURL from `VITE_API_BASE_URL`, JWT auto-attach, 401 redirect)
- **4 API modules** — `authApi.js`, `farmerApi.js`, `customerApi.js`, `adminApi.js`
- **React Router v6** — `App.jsx` with routes for `/login`, `/register`, `/customer/*`, `/farmer/*`, `/admin/*`
- **Placeholder pages** — CustomerDashboard, Markets, Products, CustomerOrders, FarmerDashboard, FarmerStock, FarmerOrders, AdminDashboard, AdminFarmers, AdminMarkets, Login, Register
- **FontAwesome** — @fortawesome/react-fontawesome + solid/regular/brands icon packs installed
- `src/context/AuthContext.js` placeholder (noted: auth state lives in Redux, not Context)
- `main.jsx` — wrapped in Redux `<Provider>`

**Root**
- `.env.example` — dummy values for PORT, MONGO_URI, JWT_SECRET
- `.gitignore` — node_modules, .env, dist/, build/, .DS_Store

### Test results
- ✅ Server: all 18 files pass `node --check` syntax validation; Express binds port 5000 on startup
- ✅ Server: MongoDB ECONNREFUSED on localhost as expected (no DB running locally yet — normal)
- ✅ Client: `npm run build` exits 0, 46 modules transformed, zero errors or warnings

### Issues / notes
- shadcn/ui `init --defaults` required `jsconfig.json` with path aliases before it could run
- Tailwind v4 uses `@import "tailwindcss"` directive (not `@tailwind base/components/utilities`)
- bcrypt required `npm approve-scripts bcrypt` due to npm's allow-scripts policy

### Current status
**Phase 0 complete.**

---

## [2026-09-23] [Phase 1] [COMPLETE] — Authentication & Role Middleware

### What was completed

**Server (`server/`)**
- `middleware/authMiddleware.js`:
  - `verifyToken`: Validates Bearer JWT header, extracts payload, attaches `req.user = { user_id, role }`.
  - `requireRole(...roles)`: Enforces role permissions supporting multiple allowed roles.
- `controllers/authController.js`:
  - `register`: Validates required fields, role validation (`customer`, `farmer`, `admin`), role-specific fields (`stall_name` for farmers, `address` for customers), duplicate email check, bcrypt password hashing (10 rounds), User creation + linked FarmerProfile creation for farmers, and JWT token issuance.
  - `login`: Validates credentials, checks suspension status, verifies bcrypt hash, fetches farmer profile metadata if applicable, issues 7-day JWT token.
  - `getMe`: Protected endpoint returning user details and linked farmer profile without sensitive hash.

**Client (`client/`)**
- `store/slices/authSlice.js`:
  - Extended auth state with `user`, `token`, `isLoading`, `error`.
  - Added `updateUser`, `setCredentials`, `logout`, selector helpers (`selectIsAuthenticated`, `selectUserRole`, `selectCurrentUser`, etc.).
  - Preserves token and user state in `localStorage`.
- `components/ProtectedRoute.jsx`:
  - Protected route wrapper guarding sub-routes based on token presence and user role permissions.
- `pages/Login.jsx`:
  - Responsive branded login UI using Tailwind + shadcn Button + FontAwesome icons.
  - Handles auth submission, loading state, error alerts, and dynamic role-based dashboard redirects (`/customer/dashboard`, `/farmer/dashboard`, `/admin/dashboard`).
- `pages/Register.jsx`:
  - Interactive multi-role registration interface with tab selector (`Customer`, `Farmer`, `Admin`).
  - Dynamic role-specific fields (Stall name for farmers, address for customers).
  - Validation handling, loading indicators, and post-registration routing.
- `App.jsx`:
  - Secured customer, farmer, and admin routes behind `ProtectedRoute` with specific role allowances.

### Test results
- ✅ Client: `npm run build` exits 0 with all modules compiled successfully.
- ✅ Server syntax check passes across all auth routes, middleware, and controllers.

### Current status
**Phase 1 complete.**

---

## [2026-09-23] [Phase 2] [COMPLETE] — Shared UI Shell & Design System ("eGreen Basket")

### What was completed

**Design System & Theme Tokens**
- Integrated Google Fonts: `Playfair Display` (warm serif for headings) and `Plus Jakarta Sans` (clean sans-serif for body).
- Configured CSS theme tokens in `client/src/index.css` matching the SRS "eGreen Basket" theme:
  - Primary: Deep forest green (`--forest-950`, `--forest-900`, `--forest-800`).
  - Accent: Lime / chartreuse green-yellow (`--accent-lime`, `--accent-lime-hover`).
  - Background: Warm cream & off-white (`--warm-cream`, `--warm-surface`).
  - Earthy neutrals: (`--earth-900`, `--earth-700`, `--earth-500`, `--earth-100`).
  - Order status palette: Placed (Blue), Accepted (Amber), Ready (Purple), Completed (Emerald), Cancelled (Rose).

**Shared UI Components (`client/src/components/ui/`)**
- `button.jsx`: Primary (lime), secondary (forest), outline, ghost, and size variants with active micro-animations.
- `card.jsx`: Reusable card primitives with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.
- `status-badge.jsx`: Order status badges with matching FontAwesome icons and distinct status color schemes.
- `search-input.jsx`: Clean search bar with FontAwesome search icon and clear button.

**Shared Layout Components (`client/src/components/layout/`)**
- `AnnouncementBanner.jsx`: Dismissible top notification banner with seasonal harvest alerts.
- `Navbar.jsx`: Responsive header with eGreen Basket branding, navigation links (Shop, Markets, Farmers, Map, About, Contact), interactive search, notifications, and role-aware profile dropdown / auth triggers.
- `Footer.jsx`: Multi-column footer containing brand description, shop links, farmer resources, contact details, and OpenStreetMap attribution.
- `Layout.jsx`: Master responsive layout wrapper providing consistent structure across the application.

**Showcase & Verification**
- Created `client/src/pages/Home.jsx` demonstrating the full UI shell, hero section, card grid, search bar, and status badges.
- Updated `client/src/App.jsx` with `/` landing showcase route.

### Test results
- ✅ Client: `npm run build` exits 0 with all modules compiled successfully.
- ✅ Responsive design verified across mobile, tablet, and desktop breakpoints.

### Current status
**Phase 2 complete.**

---

## [2026-09-23] [Phase 2.5] [COMPLETE] — Code Audit & Cleanup

### What was completed

**1. Removed Unused Context**
- Deleted `client/src/context/AuthContext.js` (and empty directory) confirming zero lingering imports or references, reinforcing Redux Toolkit as the single source of truth for global state.

**2. Standardized UI Copy & Eliminated Em Dashes**
- Audited all `.jsx`, `.js`, and `.html` files for em dash (`—`) occurrences in UI copy.
- Updated all 9 placeholder pages (`CustomerDashboard`, `Markets`, `Products`, `CustomerOrders`, `FarmerDashboard`, `FarmerStock`, `FarmerOrders`, `AdminDashboard`, `AdminFarmers`, `AdminMarkets`) with layout wrappers, meaningful descriptions, and clean typography.
- Updated document title in `client/index.html` and cleaned up internal API comments.

**3. Cleaned Stale Dev Ownership Comments**
- Removed "Dev N owns this file" comments across all API service layers and backend controllers:
  - `client/src/api/authApi.js`, `farmerApi.js`, `customerApi.js`, `adminApi.js`
  - `server/controllers/authController.js`, `farmerController.js`, `customerController.js`, `adminController.js`

**4. Removed Hardcoded Sample Products from Components**
- Removed hardcoded `sampleProducts` from `client/src/pages/Home.jsx`.
- Connected the showcase section to real `getProducts` API endpoint with clean loading spinner state and an informative empty state ("New listings coming soon") for when no products are available.

### Test results
- ✅ Verified 0 occurrences of em dash across all client files.
- ✅ Client: `npm run build` exits 0 with zero errors.

### Current status
**Phase 2.5 complete.**

---

## [2026-09-24] [Phase 3] [COMPLETE] - Auth Hardening

### What was completed

**Part A: Removed Public Admin Registration**
- Client: Removed the "Admin" role tab from `client/src/pages/Register.jsx` (only Customer and Farmer remain selectable).
- Server: Updated `server/controllers/authController.js` to reject any public registration with `role: 'admin'`, returning a 403 status code with message `"Admin registration is not allowed through public signup"`.

**Part B: Admin Seed Script & Docs**
- Created standalone script `server/scripts/seedAdmin.js` reading `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`, creating or updating the admin user with hashed password and `status: 'active'`.
- Updated `.env.example` with placeholders for `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
- Verified `README.md` includes instructions under "Creating the First Admin Account".

**Part C: Farmer Approval Status Workflow**
- Updated `server/models/User.js` status enum to `['pending', 'active', 'suspended']`.
- Updated `server/controllers/authController.js` registration logic so new farmers default to status `"pending"`, while new customers default to `"active"`.
- Added `requireActiveUser` middleware in `server/middleware/authMiddleware.js` and wired it into `server/routes/farmerRoutes.js` to protect product and order operations while allowing pending farmers to log in and manage their profile.

**Part D: Forgot Password & Password Reset (Nodemailer + OTP)**
- Extended `User` model with `otp_code`, `otp_expires_at`, `otp_resend_count`, and `otp_last_sent_at`.
- Created `server/config/mailer.js` configured with Nodemailer transport and dev console fallback when SMTP is unconfigured or in local testing.
- Implemented `POST /api/auth/forgot-password` (generates 6-digit OTP with 10-minute expiry) and `POST /api/auth/reset-password` (validates OTP, verifies expiry, securely updates bcrypt password hash).
- Created frontend views `client/src/pages/ForgotPassword.jsx` and `client/src/pages/ResetPassword.jsx`, wired routes in `client/src/App.jsx`, linked from `client/src/pages/Login.jsx`, and added endpoints to `client/src/api/authApi.js`.

### Test results
- Passed: Public admin registration rejected with 403 on API and absent in UI.
- Passed: Admin seed script idempotently creates/updates admin user in MongoDB.
- Passed: Farmer registered with `status: 'pending'`, permitted to access profile, blocked with 403 from creating products (`"Your account is pending admin approval"`).
- Passed: Customer registered with immediate `status: 'active'`.
- Passed: Forgot password OTP generated and delivered, password reset successfully with OTP, previous password rejected, new password authenticated.
- Passed: Client build (`npm run build`) succeeded with 0 errors.

### Current status
**Phase 3 complete.**




