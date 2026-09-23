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
**Phase 0 complete. Ready for Phase 1 when instructed.**
