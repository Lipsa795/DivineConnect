import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API_BASE_URL from '../config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }
    
    setResetLoading(true);
    setResetError('');
    setResetMessage('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetMessage(data.message || 'Password reset link has been sent to your email');
        setResetEmail('');
      } else {
        setResetError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setResetError('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          
          {!showForgotPassword ? (
            // LOGIN FORM
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-3 animate-bounce">🕉️</div>
                <h2 className="text-3xl font-bold text-amber-900">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to continue your spiritual journey</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="devotee@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">Password</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-700 transition"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
                    </button>
                  </div>
                </div>

                <div className="text-right mb-6">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-amber-600 hover:text-amber-800 transition font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-3 rounded-lg hover:from-amber-800 hover:to-amber-700 transition disabled:opacity-50 font-semibold text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-sign-in-alt"></i>
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-amber-700 font-semibold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  <i className="fas fa-shield-alt mr-1"></i>
                  Secure login powered by DivineConnect
                </p>
              </div>
            </>
          ) : (
            // FORGOT PASSWORD FORM
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">🔐</div>
                <h2 className="text-3xl font-bold text-amber-900">Reset Password</h2>
                <p className="text-gray-600 mt-2 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {resetError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i>
                  {resetError}
                </div>
              )}

              {resetMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-2">
                  <i className="fas fa-check-circle"></i>
                  {resetMessage}
                </div>
              )}

              <form onSubmit={handleForgotPassword}>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="devotee@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-3 rounded-lg hover:from-amber-800 hover:to-amber-700 transition disabled:opacity-50 font-semibold"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-paper-plane"></i>
                      Send Reset Link
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage('');
                    setResetError('');
                    setResetEmail('');
                  }}
                  className="w-full mt-3 text-gray-600 hover:text-amber-700 transition text-sm"
                >
                  ← Back to Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;