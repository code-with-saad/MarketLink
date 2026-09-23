import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Shared pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Markets from './pages/customer/Markets';
import Products from './pages/customer/Products';
import CustomerOrders from './pages/customer/CustomerOrders';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerStock from './pages/farmer/FarmerStock';
import FarmerOrders from './pages/farmer/FarmerOrders';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFarmers from './pages/admin/AdminFarmers';
import AdminMarkets from './pages/admin/AdminMarkets';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing & Showcase */}
        <Route path="/" element={<Home />} />

        {/* Public Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


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
        </Route>

        {/* Protected Admin section */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/farmers" element={<AdminFarmers />} />
          <Route path="/admin/markets" element={<AdminMarkets />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

