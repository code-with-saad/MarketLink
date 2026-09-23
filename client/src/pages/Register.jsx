import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerApi } from '../api/authApi';
import { setCredentials, setLoading, setError, clearError, selectIsLoading, selectAuthError } from '../store/slices/authSlice';
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, 
  faUser, 
  faEnvelope, 
  faLock, 
  faPhone, 
  faMapMarkerAlt, 
  faStore, 
  faArrowRight, 
  faCircleNotch,
  faShoppingBasket,
  faTractor,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact_number: '',
    address: '',
    stall_name: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name || !formData.email || !formData.password) {
      dispatch(setError('Please fill in all required fields'));
      return;
    }

    if (role === 'customer' && !formData.address) {
      dispatch(setError('Delivery/Pickup address is required for customers'));
      return;
    }

    if (role === 'farmer' && !formData.stall_name) {
      dispatch(setError('Stall or Farm name is required for farmers'));
      return;
    }

    try {
      dispatch(setLoading(true));
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        contact_number: formData.contact_number,
        ...(role === 'customer' ? { address: formData.address } : {}),
        ...(role === 'farmer' ? { stall_name: formData.stall_name, address: formData.address } : {}),
      };

      const res = await registerApi(payload);
      const { user, token } = res.data;
      dispatch(setCredentials({ user, token }));
      dispatch(setLoading(false));

      // Redirect to appropriate dashboard based on registered role
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      dispatch(setLoading(false));
      const message = err.response?.data?.message || 'Registration failed. Please check your details.';
      dispatch(setError(message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-emerald-100/50 p-8 sm:p-10 transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-3 text-white">
            <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Join the MarketLink Community</p>
        </div>

        {/* Role Selector Tabs - Customer and Farmer only */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleSelect('customer')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FontAwesomeIcon icon={faShoppingBasket} className="text-base" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('farmer')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              role === 'farmer'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FontAwesomeIcon icon={faTractor} className="text-base" />
            <span>Farmer</span>
          </button>
        </div>


        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Contact Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Role specific: Farmer Stall Name */}
          {role === 'farmer' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Stall / Farm Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faStore} />
                </div>
                <input
                  type="text"
                  name="stall_name"
                  value={formData.stall_name}
                  onChange={handleChange}
                  placeholder="Green Meadow Organic Farm"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Role specific: Customer Address */}
          {(role === 'customer' || role === 'farmer') && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Address {role === 'customer' ? '*' : '(Optional)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Harvest Way, Greenfield"
                  required={role === 'customer'}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

