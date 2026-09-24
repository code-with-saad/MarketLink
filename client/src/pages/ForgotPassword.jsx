import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  forgotPassword as forgotPasswordApi,
  resendOtp as resendOtpApi,
  resetPassword as resetPasswordApi,
} from '../api/authApi';
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faEnvelope,
  faKey,
  faLock,
  faArrowRight,
  faCircleNotch,
  faArrowLeft,
  faCheckCircle,
  faEye,
  faEyeSlash,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';

const OTP_TTL_SECONDS = 10 * 60;

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center gap-0 mb-8">
    {[1, 2, 3].map((step, idx) => (
      <div key={step} className="flex items-center flex-1 last:flex-none">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              step < currentStep
                ? 'bg-forest-900 border-forest-900 text-accent-lime'
                : step === currentStep
                ? 'bg-accent-lime border-accent-lime text-forest-950'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            {step < currentStep ? <FontAwesomeIcon icon={faCheckCircle} className="text-sm" /> : step}
          </div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide ${
              step === currentStep ? 'text-forest-900' : step < currentStep ? 'text-forest-700' : 'text-gray-400'
            }`}
          >
            {step === 1 ? 'Email' : step === 2 ? 'Code' : 'Password'}
          </span>
        </div>
        {idx < 2 && (
          <div
            className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300 ${
              step < currentStep ? 'bg-forest-900' : 'bg-gray-200'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const stepFromUrl = parseInt(searchParams.get('step') || '1', 10);
  const validStep = [1, 2, 3].includes(stepFromUrl) ? stepFromUrl : 1;

  const [step, setStep] = useState(validStep);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_TTL_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendsUsed, setResendsUsed] = useState(0);
  const MAX_RESENDS = 3;

  const otpTimerRef = useRef(null);
  const resendTimerRef = useRef(null);

  // Guard: if URL says step 2 or 3 but no email in state, reset to step 1
  useEffect(() => {
    if (validStep > 1 && !email) {
      goToStep(1);
    }
  }, []);

  useEffect(() => {
    if (step !== validStep) {
      goToStep(step);
    }
  }, [step]);

  const goToStep = (n) => {
    setStep(n);
    setError(null);
    setFieldErrors({});
    setSearchParams({ step: String(n) }, { replace: true });
  };

  const startOtpTimer = (secondsLeft = OTP_TTL_SECONDS) => {
    clearInterval(otpTimerRef.current);
    setOtpSecondsLeft(secondsLeft);
    otpTimerRef.current = setInterval(() => {
      setOtpSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(otpTimerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const startResendCooldown = (secs = 60) => {
    clearInterval(resendTimerRef.current);
    setResendCooldown(secs);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(resendTimerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => () => {
    clearInterval(otpTimerRef.current);
    clearInterval(resendTimerRef.current);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Step 1: Submit email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    if (!email.trim()) {
      setFieldErrors({ email: 'Email address is required.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors({ email: 'Enter a valid email address.' });
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await forgotPasswordApi({ email: email.trim() });
      setIsLoading(false);
      setResendsUsed(0);
      startOtpTimer();
      startResendCooldown();
      goToStep(2);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Failed to send code. Please try again.');
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    if (!otp.trim() || otp.trim().length !== 6 || !/^\d{6}$/.test(otp.trim())) {
      setFieldErrors({ otp: 'Enter the 6-digit code from your email.' });
      return;
    }
    if (otpSecondsLeft === 0) {
      setError('The code has expired. Please resend or start again.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      // Verify by attempting reset with a dummy password to check OTP validity --
      // Actually: just proceed to step 3, OTP is verified on final submit server-side.
      // This avoids consuming the OTP early. The server will reject an expired OTP.
      setIsLoading(false);
      goToStep(3);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    }
  };

  // Step 2: Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || resendsUsed >= MAX_RESENDS) return;
    try {
      setError(null);
      const res = await resendOtpApi({ email: email.trim() });
      if (res.data.forceRestart) {
        setError('Maximum resend attempts reached. Please start the process again.');
        setResendsUsed(MAX_RESENDS);
        setTimeout(() => goToStep(1), 3000);
        return;
      }
      const newResendsUsed = resendsUsed + 1;
      setResendsUsed(newResendsUsed);
      startOtpTimer();
      startResendCooldown();
      setOtp('');
    } catch (err) {
      const data = err.response?.data;
      if (data?.forceRestart) {
        setError('Maximum resend attempts reached. You will be returned to step 1.');
        setResendsUsed(MAX_RESENDS);
        setTimeout(() => goToStep(1), 3000);
        return;
      }
      if (data?.cooldownRemaining) {
        setResendCooldown(data.cooldownRemaining);
        startResendCooldown(data.cooldownRemaining);
      }
      setError(data?.message || 'Failed to resend code.');
    }
  };

  // Step 3: Reset password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const errs = {};
    if (newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters.';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await resetPasswordApi({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      setIsLoading(false);
      navigate('/login?success=password_reset');
    } catch (err) {
      setIsLoading(false);
      const data = err.response?.data;
      if (data?.message?.toLowerCase().includes('expired')) {
        setError('The code has expired. Please go back and resend.');
      } else {
        setError(data?.message || 'Password reset failed. Please try again.');
      }
    }
  };

  const inputBase =
    'w-full py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all';
  const inputOk = `${inputBase} border-gray-200 focus:ring-emerald-500/30 focus:border-emerald-500`;
  const inputErr = `${inputBase} border-red-300 focus:ring-red-400/30 focus:border-red-400`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100/50 p-8 sm:p-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-3 text-white">
            <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reset Password</h1>
          <p className="text-xs text-gray-500 mt-1">Step {step} of 3</p>
        </div>

        <StepIndicator currentStep={step} />

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors({}); }}
                  placeholder="you@example.com"
                  className={`pl-10 pr-4 ${fieldErrors.email ? inputErr : inputOk}`}
                  autoFocus
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Enter your registered email. If an account exists, we will send a 6-digit code. We will not confirm whether the email is registered.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-5" noValidate>
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center">
              <p>A 6-digit code was sent to <span className="font-semibold">{email}</span>.</p>
              <p className="mt-0.5 text-emerald-700">It will not reveal whether that email is registered.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Verification Code
                </label>
                <span
                  className={`text-xs font-mono font-semibold ${
                    otpSecondsLeft < 60 ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {otpSecondsLeft > 0 ? `Expires in ${formatTime(otpSecondsLeft)}` : 'Expired'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    setOtp(v);
                    setFieldErrors({});
                  }}
                  placeholder="123456"
                  className={`pl-10 pr-4 tracking-widest font-mono ${fieldErrors.otp ? inputErr : inputOk}`}
                />
              </div>
              {fieldErrors.otp && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.otp}</p>
              )}
            </div>

            {/* Resend section */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {resendsUsed < MAX_RESENDS
                  ? `${MAX_RESENDS - resendsUsed} resend${MAX_RESENDS - resendsUsed !== 1 ? 's' : ''} remaining`
                  : 'No resends remaining'}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resendsUsed >= MAX_RESENDS}
                className="flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faRotateRight} className={resendCooldown > 0 ? 'animate-spin' : ''} />
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : resendsUsed >= MAX_RESENDS
                  ? 'Limit reached'
                  : 'Resend Code'}
              </button>
            </div>

            {resendsUsed >= MAX_RESENDS && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                You have used all 3 resend attempts. Please{' '}
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="font-bold underline cursor-pointer"
                >
                  start again from step 1
                </button>
                .
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="flex-none w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6 || otpSecondsLeft === 0 || resendsUsed >= MAX_RESENDS}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, newPassword: undefined })); }}
                  placeholder="At least 6 characters"
                  className={`pl-10 pr-10 ${fieldErrors.newPassword ? inputErr : inputOk}`}
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
              {fieldErrors.newPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined })); }}
                  placeholder="Repeat new password"
                  className={`pl-10 pr-10 ${fieldErrors.confirmPassword ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="flex-none w-10 h-10 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <Button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
