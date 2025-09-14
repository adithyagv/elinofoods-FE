import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react";

// Mock auth context for demonstration
const useAuth = () => ({
  login: async (email, password) => ({
    success: true,
    customer: { firstName: "John", email },
  }),
  createAccount: async (email, password, firstName, lastName) => ({
    success: true,
    customer: { firstName, email },
  }),
  isAuthenticated: false,
  loading: false,
});

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    login,
    createAccount,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      window.location.href = "/";
    }
  }, [isAuthenticated, authLoading]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    clearMessages();

    try {
      const result = await login(email, password);

      if (result.success) {
        setSuccess(
          `Login successful! Welcome back, ${
            result.customer?.firstName || result.customer?.email
          }!`
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    clearMessages();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLocalLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions.");
      setLocalLoading(false);
      return;
    }

    try {
      const result = await createAccount(email, password, firstName, lastName);

      if (result.success) {
        if (result.requiresLogin) {
          setSuccess("Account created successfully! Please log in.");
          setTimeout(() => {
            setIsCreating(false);
            setPassword("");
            clearMessages();
          }, 2000);
        } else {
          setSuccess(
            `Account created successfully! Welcome, ${
              result.customer?.firstName || result.customer?.email
            }!`
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Create account error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const switchToCreate = () => {
    setIsCreating(true);
    clearMessages();
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setAgreedToTerms(false);
  };

  const switchToLogin = () => {
    setIsCreating(false);
    clearMessages();
    setEmail("");
    setPassword("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8e7] to-[#fff3db]">
        <div className="text-[#4B2C20]">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e7] via-white to-[#fff3db] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top flowing shape */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#ffc555] to-[#ffb347] rounded-full opacity-20 blur-3xl"></div>

        {/* Bottom flowing shape */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#ffb347] to-[#ffc555] rounded-full opacity-20 blur-3xl"></div>

        {/* Middle accent */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-[#ffd27a] to-[#ffbf5a] rounded-full opacity-10 blur-2xl"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex items-center justify-center">
          {/* Left side - Welcome message (hidden on mobile) */}
          <div className="hidden lg:flex flex-1 items-center justify-center pr-16">
            <div className="text-center max-w-md">
              <h1 className="text-5xl font-bold text-[#4B2C20] mb-6">
                {isCreating ? "Join Us!" : "Welcome Back!"}
              </h1>
              <p className="text-lg text-[#4B2C20] leading-relaxed">
                {isCreating
                  ? "Create your account and start your journey with us. Join thousands of satisfied users."
                  : "We're excited to see you again. Sign in to access your account and continue where you left off."}
              </p>
            </div>
          </div>

          {/* Right side - Form card */}
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20">
              {/* Header section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#4B2C20] mb-2">
                  {isCreating ? "Create Account" : "Hello!"}
                </h2>
                <p className="text-[#4B2C20]">
                  {isCreating
                    ? "Fill in your information below"
                    : "Sign in to your account"}
                </p>
              </div>

              {/* Back button for create account */}
              {isCreating && (
                <button
                  onClick={switchToLogin}
                  disabled={localLoading}
                  className="flex items-center text-[#4B2C20] hover:text-[#332015] transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </button>
              )}

              {!isCreating ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#4B2C20]" />
                    </div>
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={localLoading}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ffc555] focus:border-transparent transition-all placeholder-gray-500"
                    />
                  </div>

                  {/* Password field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#4B2C20]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={localLoading}
                      className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ffc555] focus:border-transparent transition-all placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      disabled={localLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#4B2C20]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#4B2C20]" />
                      )}
                    </button>
                  </div>

                  {/* Remember me and forgot password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-[#4B2C20] bg-gray-100 border-gray-300 rounded focus:ring-[#ffc555] focus:ring-2"
                      />
                      <span className="ml-2 text-[#4B2C20]">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-[#4B2C20] hover:text-[#332015] font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign in button */}
                  <button
                    type="submit"
                    disabled={localLoading}
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #4B2C20 0%, #ffc555 100%)",
                    }}
                    className="w-full text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                  >
                    {localLoading ? "Signing in..." : "SIGN IN"}
                  </button>

                  {/* Switch to create account */}
                  <div className="text-center">
                    <span className="text-gray-600">
                      Don't have an account?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={switchToCreate}
                      disabled={localLoading}
                      className="text-[#4B2C20] hover:text-[#332015] font-semibold"
                    >
                      Create
                    </button>
                  </div>
                </form>
              ) : (
                // Create Account Form
                <form onSubmit={handleCreateAccount} className="space-y-6">
                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-[#4B2C20]" />
                      </div>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={localLoading}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ffc555] focus:border-transparent transition-all placeholder-gray-500"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-purple-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={localLoading}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#4B2C20]" />
                    </div>
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={localLoading}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
                    />
                  </div>

                  {/* Password field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#4B2C20]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={localLoading}
                      className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ffc555] focus:border-transparent transition-all placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      disabled={localLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#4B2C20]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#4B2C20]" />
                      )}
                    </button>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 text-[#4B2C20] bg-gray-100 border-gray-300 rounded focus:ring-[#ffc555] focus:ring-2"
                      disabled={localLoading}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-[#4B2C20] leading-relaxed"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-[#4B2C20] hover:text-[#332015] font-medium"
                      >
                        Terms & Conditions
                      </a>
                    </label>
                  </div>

                  {/* Create account button */}
                  <button
                    type="submit"
                    disabled={localLoading || !agreedToTerms}
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #4B2C20 0%, #ffc555 100%)",
                    }}
                    className="w-full text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                  >
                    {localLoading ? "Creating Account..." : "CREATE ACCOUNT"}
                  </button>

                  {/* Switch to login */}
                  <div className="text-center">
                    <span className="text-[#4B2C20]">
                      Already have an account?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={switchToLogin}
                      disabled={localLoading}
                      className="text-[#4B2C20] hover:text-[#332015] font-semibold"
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Social login buttons */}
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-[#4B2C20]">or</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-2xl bg-white text-sm font-medium text-[#4B2C20] hover:bg-gray-50 transition-colors"
                        disabled={localLoading}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span className="ml-2">Google</span>
                      </button>

                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-2xl bg-white text-sm font-medium text-[#4B2C20] hover:bg-gray-50 transition-colors"
                        disabled={localLoading}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="ml-2">Facebook</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Error/Success messages */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
