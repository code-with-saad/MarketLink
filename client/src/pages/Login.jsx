import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginApi } from '../api/authApi';
import {
  setCredentials,
  setLoading,
  setError,
  clearError,
  selectIsLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectCurrentUser,
} from '../store/slices/authSlice';
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faEnvelope,
  faLock,
  faArrowRight,
  faCircleNotch,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

const getDashboardPath = (role) => {
  if (role === 'farmer') return '/farmer/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/customer/dashboard';
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // Reason from redirect (e.g. ?reason=expired)
  const params = new URLSearchParams(location.search);
  const expiredReason = params.get('reason') === 'expired';
  const successReset = params.get('success') === 'password_reset';

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address.';
    if (!formData.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    try {
      dispatch(setLoading(true));
      const res = await loginApi(formData);
      const { user: loggedInUser, token } = res.data;
      dispatch(setCredentials({ user: loggedInUser, token }));
      dispatch(setLoading(false));
      navigate(getDashboardPath(loggedInUser.role), { replace: true });
    } catch (err) {
      dispatch(setLoading(false));
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        data.errors.forEach((e) => { mapped[e.field] = e.message; });
        setFieldErrors(mapped);
      } else {
        dispatch(setError(data?.message || 'Login failed. Please check your credentials.'));
      }
    }
  };

  const inputBase = 'w-full py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all';
  const inputOk = `${inputBase} border-gray-200 focus:ring-emerald-500/30 focus:border-emerald-500`;
  const inputErr = `${inputBase} border-red-300 focus:ring-red-400/30 focus:border-red-400`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100/50 p-8 sm:p-10 transition-all">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-3 text-white">
            <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MarketLink</h1>
          <p className="text-sm text-gray-500 mt-1">Connecting Local Farmers and Communities</p>
        </div>

        {expiredReason && (
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
            Your session has expired. Please sign in again.
          </div>
        )}

        {successReset && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl">
            Password reset successfully. You can now sign in with your new password.
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`pl-10 pr-4 ${fieldErrors.email ? inputErr : inputOk}`}
              />
            </div>
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                className={`pl-10 pr-10 ${fieldErrors.password ? inputErr : inputOk}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
          </div>

          <Button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
