import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword as forgotPasswordApi } from '../api/authApi';
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faEnvelope, faArrowRight, faCircleNotch, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await forgotPasswordApi({ email });
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (err) {
      setIsLoading(false);
      const message = err.response?.data?.message || 'Failed to send password reset code. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100/50 p-8 sm:p-10 transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-3 text-white">
            <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Enter your email address and we will send you a 6-digit verification OTP.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start">
            <span>{error}</span>
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
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
                  <span>Send Reset OTP</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-emerald-600 mb-2 block mx-auto" />
              <p className="font-semibold">Reset code sent!</p>
              <p className="mt-1 text-xs text-emerald-700">
                If an account exists for <span className="font-medium">{email}</span>, you will receive a 6-digit OTP code shortly.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => navigate('/reset-password', { state: { email } })}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Enter OTP & Reset Password</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
