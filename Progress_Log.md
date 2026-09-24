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

---

## [2026-09-24] [Phase 3.6] [COMPLETE] — Production Hardening

### What was completed

**Part A — Auth Security and UX**
- JWT token expiry reduced from 7d to 2h in both `register` and `login` controllers.
- `axiosInstance.js`: 401 interceptor now dispatches Redux `logout()` (clearing both `token` and `user` from localStorage) and redirects to `/login?reason=expired`.
- Login page shows a session-expired banner when redirected with `?reason=expired`.
- Session persistence on refresh: `AppInit.jsx` wraps the app and calls `GET /api/auth/me` on mount if a token exists, rehydrating Redux auth state before routes render. Shows a loading spinner while the check is in flight.
- `main.jsx` updated to use the new `AppInit` wrapper with ready-state gating.
- Logout now navigates to the homepage (`/`) instead of `/login`.
- Password eye-icon (show/hide) toggle added to all password fields: Login, Register, ForgotPassword (step 3).

**Part B — Forgot Password Wizard and Rate Limiting**
- Rate limiting via `express-rate-limit` applied to: `/api/auth/login` (10/15min), `/api/auth/register` (10/hr), `/api/auth/forgot-password` (5/15min), `/api/auth/resend-otp` (6/15min), `/api/auth/reset-password` (5/15min).
- New `POST /api/auth/resend-otp` route with server-side 1-minute cooldown and max-3-resend enforcement using `otp_resend_count` and `otp_last_sent_at` fields on User model.
- `ForgotPassword.jsx` completely rebuilt as a single-page 3-step wizard with step indicator bar (numbered circles, filled/unfilled, completed steps show checkmark).
  - Step 1: Email entry. Always shows generic message (no email enumeration). Auto-advances to step 2.
  - Step 2: OTP entry with countdown timer (`MM:SS`), resend button with 1-min client cooldown and server enforcement, resend count display, force-back-to-step-1 after 3 resends with explanation message.
  - Step 3: New password + confirm password, both with eye-icon toggles.
- URL uses `?step=N` for deep-linkability. Back navigation guards prevent landing on step 2/3 without prior email/OTP state.
- `ResetPassword.jsx` deleted (merged into wizard).
- `forgotPassword` controller now always returns a generic message regardless of whether the email exists.
- OTP expiry checked server-side on `/reset-password` — expired OTP rejected even if code is technically correct.
- After 3 resends server-side: session cleared (OTP, resend count), client forced back to step 1.
- Successful password reset redirects to `/login?success=password_reset` with a success banner.

**Part C — Input Validation**
- `express-validator` validation rules added on all auth routes: register (name, email, password, role, consent), login (email, password), forgot-password (email), resend-otp (email), reset-password (email, otp, new_password).
- Backend returns 400 with field-level `errors` array: `[{ field, message }]`.
- Frontend `Login.jsx` and `Register.jsx`: inline field-level error text under each input, submit disabled while invalid fields present.

**Part D — Error Handling and Missing Pages**
- Global Express error handler already present with `{ success: false, message }` shape (verified consistent).
- `NotFound.jsx` created: proper 404 page with "Go to Homepage" and "Go Back" buttons, styled to match the design system.
- App.jsx `*` wildcard now renders `<NotFound />` instead of redirecting to `/login`.
- CORS restricted to `CLIENT_ORIGIN` from `.env` (already was set; `CLIENT_ORIGIN=http://localhost:5173` explicitly added to `.env`).

**Part E — Legal Pages and Consent**
- `PrivacyPolicy.jsx` created: full-content page with 8 sections covering data collection, usage, retention, security, user rights, and contact.
- `TermsOfService.jsx` created: full-content page with 10 sections covering eligibility, conduct, farmer responsibilities, orders, IP, disclaimers, and liability.
- `ComingSoon.jsx` created: placeholder page for footer links pointing to future modules.
- `Register.jsx`: consent checkbox added using new `Checkbox` component with links to Privacy Policy and Terms of Service (both open in new tab). Submit button disabled until checkbox is checked AND form fields are valid.
- Backend `register` controller: rejects requests where `consent !== true` with a 400 error.
- `checkbox.jsx` component created in `components/ui/`.

**Part F — Dark/Light Mode**
- `useDarkMode.js` hook: reads `localStorage` key `ml-theme`, falls back to `prefers-color-scheme` on first visit, applies/removes `.dark` class on `<html>`, persists choice on every toggle.
- `index.css`: `--forest-*` tokens maintained as fixed brand colors for constant dark green backgrounds (Navbar, Hero container, Footer). Reverted global token overrides that inverted these backgrounds.
- Theme-aware text styling: updated all page headings, card titles (`card.jsx`), links, button variants (`button.jsx`), and search input (`search-input.jsx`) across all pages to use semantic theme tokens (`text-foreground`, `text-card-foreground`, `text-primary`, `border-primary`) so text cleanly toggles between light and dark modes while keeping fixed brand backgrounds intact.
- `Navbar.jsx`: dark/light toggle button (FontAwesome `faSun` / `faMoon`) added to desktop and mobile header.

**Part G — Footer and UI Cleanup**
- `Home.jsx`: "Design System Status Indicators" block removed. Unused `StatusBadge`, `CardContent` imports removed.
- `Footer.jsx`: All dead `href="#"` links replaced. Links to future modules now point to `/coming-soon`. Privacy Policy and Terms of Service links added to the bottom bar.
- Navbar dead links (Farmers, Map, About, Contact) now point to `/coming-soon` instead of wrong customer routes.

**Part H — Guest Route Guard**
- `GuestRoute` wrapper added in `App.jsx`: if an authenticated user navigates to `/login` or `/register` (including via browser back button), they are redirected to their role's dashboard (`/farmer/dashboard`, `/admin/dashboard`, or `/customer/dashboard`).
- Login and Register pages also have a `useEffect` guard for runtime re-checks.

### Files changed
**New files:** `AppInit.jsx`, `NotFound.jsx`, `PrivacyPolicy.jsx`, `TermsOfService.jsx`, `ComingSoon.jsx`, `checkbox.jsx`, `useDarkMode.js`
**Modified files:** `authController.js`, `authRoutes.js`, `authApi.js`, `axiosInstance.js`, `main.jsx`, `App.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `Navbar.jsx`, `Footer.jsx`, `Home.jsx`, `index.css`, `server/.env`
**Deleted files:** `ResetPassword.jsx`

### Test results
- Build: `npm run build` exits 0 with zero errors (only chunk size warning).
- Backend: server starts on port 5000, MongoDB connected.
- Frontend: Vite starts on port 5173 with zero compile errors.

### Current status
**Phase 3.6 complete.**

---

## [2026-09-24] [UX Feature] [COMPLETE] — Registration Legal Document Dialog Modals

### What was completed
1. **Shadcn Dialog Component**: Added `client/src/components/ui/dialog.jsx` using `@base-ui/react/dialog` primitive.
2. **Single Source of Truth**: Created `client/src/components/LegalContent.jsx` containing `PrivacyPolicyContent` and `TermsOfServiceContent`. Refactored standalone `PrivacyPolicy.jsx` and `TermsOfService.jsx` pages to consume these shared components while preserving their permalink routes.
3. **Register Page Integration**: Replaced direct navigation links (`/privacy-policy`, `/terms-of-service`) on `Register.jsx` with modal trigger buttons that open an in-page `Dialog`.
4. **Form State Preservation**: The modal allows full scrolling, keyboard `Escape` closing, overlay clicking, and close button (`X`) closing without navigating away or resetting any form inputs typed by the user.
5. **Dark Mode Compliance**: Styled `Dialog` and content using theme-aware tokens (`bg-warm-surface`, `text-foreground`, `border-earth-200`) so modals render cleanly in both light and dark modes.

### Verification
- `npm run build` completed cleanly with zero syntax/compilation errors.
- Automated Playwright test (`test_register_modal.js`) verified that filling inputs, opening/scrolling Privacy Policy, closing, opening/closing Terms of Service retains all typed form data perfectly.

---

## [2026-09-24] [Bug Fix] [COMPLETE] — 401 Interceptor Public Route Unconditional Redirection

### Cause
In `client/src/api/axiosInstance.js`, the response interceptor previously handled all `401` HTTP statuses by unconditionally dispatching `logout()` and triggering `window.location.href = '/login?reason=expired'`. On initial app load (`AppInit.jsx`), `getMe()` (`GET /api/auth/me`) checks for session validity. If `localStorage` contained an invalid/expired token or if an unauthenticated request returned `401` on public pages like `/`, the interceptor forcibly redirected anonymous users to `/login?reason=expired`.

### Fix Applied
1. **Token Check**: In `axiosInstance.js`, the 401 handler verifies `Boolean(localStorage.getItem('token'))` prior to clearing credentials. If no token was present, credentials are cleared silently without triggering a redirect.
2. **Protected Route Guarding**: Redirection to `/login?reason=expired` only fires if the request occurred while the user was on a protected path (`/customer/*`, `/farmer/*`, or `/admin/*`). Unauthenticated or stale 401s on public routes (`/`, `/privacy-policy`, `/terms-of-service`, `/coming-soon`) clear auth state silently and keep the user on their active page.
3. **SPA Navigation Integration**: Created `client/src/utils/navigation.js` and registered `NavigateSetter` in `App.jsx`. `axiosInstance.js` uses `navigateTo('/login?reason=expired')` for seamless React Router SPA transitions without reloading the page.
4. **ProtectedRoute Query Preservation**: Updated `ProtectedRoute.jsx` to append `?reason=expired` when redirecting unauthenticated users from protected pages.

### Verification
- Automated Playwright suite (`test_401_interceptor.js`) verified:
  - Visiting `/` anonymously: stays on `/` (exits 0).
  - Visiting `/` with an invalid token: token silently purged, stays on `/` (exits 0).
  - Visiting `/customer/dashboard` with an invalid token: redirects seamlessly to `/login?reason=expired`.
- `npm run build` exited cleanly with 0 errors.

---

## [2026-09-24] [Phase 4] [COMPLETE] — Farmer Module (Stock & Profile Management)

### What was completed

**Backend — `/api/farmer` API Routes & Controllers**
- Added `weekly_template_quantity` field to `Product` model schema and `auto_apply_weekly_template` field to `FarmerProfile` model schema.
- `GET /api/farmer/profile` & `PUT /api/farmer/profile`: View and update farmer stall name, operating days, pickup windows, and latitude/longitude.
- `GET /api/farmer/products`, `POST /api/farmer/products`, `PUT /api/farmer/products/:id`, `DELETE /api/farmer/products/:id`: Full product CRUD. All endpoints protected with `requireActiveUser` (blocked with a 403 error for pending or suspended farmers).
- `PUT /api/farmer/products/:id/status`: Quick status toggle (`available`, `sold_out`, `unavailable`) without full form edit.
- `PUT /api/farmer/products/weekly-template`: Batch update weekly template quantities and toggle `auto_apply_weekly_template`.
- `POST /api/farmer/products/apply-weekly-template`: Resets `quantity_available` to `weekly_template_quantity` for all farmer products.

**Frontend — Farmer Dashboard Layout & Views**
- `FarmerLayout.jsx`: Responsive layout with persistent left sidebar containing farmer navigation (`Dashboard & Insights`, `Pre-orders`, `Weekly Stock`, `Markets & Pickup`, `Reviews`, `Stall Profile`, `Notifications`) and approval status badge.
- **Pending Approval Protection**: If `user.status === 'pending'`, a prominent warning banner is rendered explaining that the stall account is awaiting admin approval, and product mutation buttons are cleanly disabled.
- `FarmerStock.jsx`: Weekly stock management view containing:
  - Top "Recurring weekly stock template" control panel with auto-apply toggle and "Apply Now" instant reset button.
  - Interactive table displaying product image, name, category, price/unit, inline-editable in-stock quantity, inline-editable weekly template quantity, status dropdown selector, and edit/delete row action buttons.
  - Shared `Dialog` modal for adding and editing harvest products.
- `FarmerProfile.jsx`: Full stall profile management view for updating farm name, operating day chips, pickup window policy, and map coordinates.

**Seed Script**
- Created `server/scripts/seedFarmerData.js` to seed an approved active farmer (`farmer.active@marketlink.local`) with sample products and a pending farmer (`farmer.pending@marketlink.local`) for local testing.

### TRD Section 8 & Design System Compliance
- Adhered strictly to TRD Section 8: all text elements use theme-aware semantic tokens (`text-foreground`, `text-earth-700`, `text-primary`), dark mode tested and verified, input validation enforced, zero emojis or em dashes used, and all icon references use FontAwesome.

### Verification
- `npm run build` executed cleanly with 0 compilation errors.
- Automated Playwright suite (`test_phase4_farmer.js`) verified:
  - Approved farmer login -> weekly stock table rendering, inline quantity updates, status toggling, and "Apply Now" template reset.
  - Pending farmer login -> pending warning banner visible, product creation buttons disabled, backend 403 authorization guard active.
