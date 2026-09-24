import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerApi } from '../api/authApi';
import {
  setCredentials,
  setLoading,
  clearError,
  selectIsLoading,
  selectIsAuthenticated,
  selectCurrentUser,
} from '../store/slices/authSlice';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { PrivacyPolicyContent, TermsOfServiceContent } from '../components/LegalContent';
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
  faEye,
  faEyeSlash,
  faShieldAlt,
  faFileContract,
} from '@fortawesome/free-solid-svg-icons';

const getDashboardPath = (role) => {
  if (role === 'farmer') return '/farmer/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/customer/dashboard';
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    if (submitError) setSubmitError(null);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFieldErrors({});
    setSubmitError(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) errs.name = 'Full name must be at least 2 characters.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'A valid email address is required.';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (role === 'farmer' && !formData.stall_name.trim()) errs.stall_name = 'Stall or farm name is required for farmer registration.';
    if (role === 'customer' && !formData.address.trim()) errs.address = 'Delivery address is required for customer registration.';
    if (!consent) errs.consent = 'You must accept the Privacy Policy and Terms of Service to register.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    try {
      dispatch(setLoading(true));
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        contact_number: formData.contact_number,
        ...(role === 'customer' ? { address: formData.address } : {}),
        ...(role === 'farmer' ? { stall_name: formData.stall_name.trim(), address: formData.address } : {}),
        consent: true,
      };

      const res = await registerApi(payload);
      const { user: registeredUser, token } = res.data;
      dispatch(setCredentials({ user: registeredUser, token }));
      dispatch(setLoading(false));
      navigate(getDashboardPath(registeredUser.role), { replace: true });
    } catch (err) {
      dispatch(setLoading(false));
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        data.errors.forEach((e) => { mapped[e.field] = e.message; });
        setFieldErrors(mapped);
      } else {
        setSubmitError(data?.message || 'Registration failed. Please check your details.');
      }
    }
  };

  const inputBase = 'w-full py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all';
  const inputOk = `${inputBase} border-gray-200 focus:ring-emerald-500/30 focus:border-emerald-500`;
  const inputErr = `${inputBase} border-red-300 focus:ring-red-400/30 focus:border-red-400`;

  const isFormValid = consent && formData.name && formData.email && formData.password.length >= 6 &&
    (role !== 'customer' || formData.address) && (role !== 'farmer' || formData.stall_name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-emerald-100/50 p-8 sm:p-10 transition-all">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-3 text-white">
            <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Join the MarketLink Community</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleSelect('customer')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              role === 'customer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FontAwesomeIcon icon={faShoppingBasket} className="text-base" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('farmer')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              role === 'farmer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FontAwesomeIcon icon={faTractor} className="text-base" />
            <span>Farmer</span>
          </button>
        </div>

        {submitError && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                id="reg-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={`pl-10 pr-4 ${fieldErrors.name ? inputErr : inputOk}`}
              />
            </div>
            {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className={`pl-10 pr-4 ${fieldErrors.email ? inputErr : inputOk}`}
              />
            </div>
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
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

          {/* Contact Number */}
          <div>
            <label htmlFor="reg-contact" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Contact Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <input
                id="reg-contact"
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`pl-10 pr-4 ${inputOk}`}
              />
            </div>
          </div>

          {/* Farmer Stall Name */}
          {role === 'farmer' && (
            <div>
              <label htmlFor="reg-stall" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Stall / Farm Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faStore} />
                </div>
                <input
                  id="reg-stall"
                  type="text"
                  name="stall_name"
                  value={formData.stall_name}
                  onChange={handleChange}
                  placeholder="Green Meadow Organic Farm"
                  className={`pl-10 pr-4 ${fieldErrors.stall_name ? inputErr : inputOk}`}
                />
              </div>
              {fieldErrors.stall_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.stall_name}</p>}
            </div>
          )}

          {/* Address */}
          {(role === 'customer' || role === 'farmer') && (
            <div>
              <label htmlFor="reg-address" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Address {role === 'customer' ? '*' : '(Optional)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <input
                  id="reg-address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Harvest Way, Greenfield"
                  className={`pl-10 pr-4 ${fieldErrors.address ? inputErr : inputOk}`}
                />
              </div>
              {fieldErrors.address && <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>}
            </div>
          )}

          {/* Consent Checkbox */}
          <div className="pt-1">
            <div className="flex items-start gap-3">
              <Checkbox
                id="reg-consent"
                checked={consent}
                onCheckedChange={setConsent}
                className="mt-0.5"
              />
              <label htmlFor="reg-consent" className="text-sm text-gray-600 cursor-pointer leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="font-semibold text-emerald-600 hover:underline cursor-pointer focus:outline-none"
                >
                  Privacy Policy
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  className="font-semibold text-emerald-600 hover:underline cursor-pointer focus:outline-none"
                >
                  Terms of Service
                </button>
                .
              </label>
            </div>
            {fieldErrors.consent && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.consent}</p>}
          </div>

          <Button
            id="reg-submit"
            type="submit"
            disabled={isLoading || !isFormValid}
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

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
            Sign In
          </Link>
        </div>

        {/* Legal Document Dialog Modal */}
        <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent showCloseButton={true} className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-warm-surface border border-earth-200">
            <DialogHeader className="p-6 pb-4 border-b border-earth-100 flex flex-row items-center gap-3">
              <div className="w-10 h-10 bg-forest-900 text-accent-lime rounded-xl flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={activeModal === 'privacy' ? faShieldAlt : faFileContract} />
              </div>
              <div>
                <DialogTitle className="font-serif text-xl font-bold text-foreground">
                  {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </DialogTitle>
                <DialogDescription className="text-xs text-earth-500 mt-0.5">
                  Last updated: September 2026
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              {activeModal === 'privacy' ? <PrivacyPolicyContent /> : <TermsOfServiceContent />}
            </div>
            <div className="p-4 border-t border-earth-100 bg-warm-cream flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Register;
