import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from './store/slices/authSlice';

// Shared pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ComingSoon from './pages/ComingSoon';

// Protected route guard
import ProtectedRoute from './components/ProtectedRoute';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Markets from './pages/customer/Markets';
import Products from './pages/customer/Products';
import CustomerOrders from './pages/customer/CustomerOrders';

import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerStock from './pages/farmer/FarmerStock';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerProfile from './pages/farmer/FarmerProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFarmers from './pages/admin/AdminFarmers';
import AdminMarkets from './pages/admin/AdminMarkets';

const getDashboardPath = (role) => {
  if (role === 'farmer') return '/farmer/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/customer/dashboard';
};

// GuestRoute: redirects authenticated users away from auth pages
const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  return children;
};

import { setNavigate } from './utils/navigation';

function NavigateSetter() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null;
}

function App() {
  return (
    <Router>
      <NavigateSetter />
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Home />} />

        {/* Legal / static pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/coming-soon" element={<ComingSoon />} />

        {/* Auth routes -- redirect authenticated users away */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Customer section */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/markets" element={<Markets />} />
          <Route path="/customer/products" element={<Products />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
        </Route>

        {/* Protected Farmer section */}
        <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/stock" element={<FarmerStock />} />
          <Route path="/farmer/orders" element={<FarmerOrders />} />
          <Route path="/farmer/profile" element={<FarmerProfile />} />
          <Route path="/farmer/markets" element={<FarmerProfile />} />
          <Route path="/farmer/reviews" element={<FarmerProfile />} />
          <Route path="/farmer/notifications" element={<FarmerProfile />} />
        </Route>

        {/* Protected Admin section */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/farmers" element={<AdminFarmers />} />
          <Route path="/admin/markets" element={<AdminMarkets />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
