import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

// Add CSS animations using a style tag
if (
  typeof document !== "undefined" &&
  !document.head.querySelector("style[data-login-styles]")
) {
  const styleSheet = document.createElement("style");
  styleSheet.setAttribute("data-login-styles", "true");
  styleSheet.textContent = `
    @keyframes pulse {
      0%, 100% {
        opacity: 0.6;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.1);
      }
    }
    
    @keyframes flow {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.7;
      }
    }
    
    @media (min-width: 1024px) {
      .visual-side-responsive {
        display: flex !important;
      }
    }
    
    .input-focus:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }
    
    .button-hover:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    .primary-button-hover:hover:not(:disabled) {
      background-color: #1f2937 !important;
    }
    
    .link-button-hover:hover:not(:disabled) {
      color: #5b21b6 !important;
    }
    
    .social-button-hover:hover:not(:disabled) {
      background-color: #f9fafb !important;
    }
    
    .back-button-hover:hover:not(:disabled) {
      color: #374151 !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

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

  // Get auth functions from context
  const {
    login,
    createAccount,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      window.location.href = "/";
    }
  }, [isAuthenticated, authLoading]);

  // Clear messages when switching forms
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Handle Login using AuthContext
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

        // Redirect after a short delay
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

  // Handle Account Creation using AuthContext
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    clearMessages();

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLocalLoading(false);
      return;
    }

    // Added terms validation
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

  // Switch between login and create account
  const switchToCreate = () => {
    setIsCreating(true);
    clearMessages();
    // Reset form fields
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setAgreedToTerms(false);
  };

  const switchToLogin = () => {
    setIsCreating(false);
    clearMessages();
    // Reset form fields
    setEmail("");
    setPassword("");
  };

  // Show loading if auth is checking
  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Checking authentication...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Left Side - Visual */}
      <div style={styles.visualSide} className="visual-side-responsive">
        <div style={styles.visualBackground}>
          <div style={{ ...styles.gradientOrb, ...styles.orb1 }}></div>
          <div style={{ ...styles.gradientOrb, ...styles.orb2 }}></div>
          <div style={{ ...styles.gradientOrb, ...styles.orb3 }}></div>
        </div>

        <svg
          style={styles.flowingSvg}
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>
          <path
            d="M50,100 Q200,50 350,200 T250,450 Q100,400 50,300 Z"
            fill="none"
            stroke="url(#flow1)"
            strokeWidth="2"
            style={{ animation: "flow 6s ease-in-out infinite" }}
          />
          <path
            d="M0,200 Q150,150 300,300 T200,550 Q50,500 0,400 Z"
            fill="none"
            stroke="url(#flow1)"
            strokeWidth="1.5"
            style={{
              animation: "flow 6s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
        </svg>

        <div style={styles.logo}>
          <div style={styles.logoIcon}></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={styles.formSide}>
        <div style={styles.formContainer}>
          {isCreating && (
            <button
              onClick={switchToLogin}
              style={styles.backButton}
              className="back-button-hover"
              disabled={localLoading}
            >
              <ArrowLeft style={styles.backIcon} />
              Back
            </button>
          )}

          {!isCreating ? (
            // Login Form
            <form onSubmit={handleLogin}>
              <h1 style={styles.title}>Welcome Back</h1>
              <p style={styles.subtitle}>Please sign in to your account</p>

              <div style={styles.formSpace}>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={localLoading}
                    className="input-focus"
                    style={{
                      ...styles.input,
                      ...(localLoading ? styles.inputDisabled : {}),
                    }}
                  />
                </div>

                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={localLoading}
                    className="input-focus"
                    style={{
                      ...styles.input,
                      ...styles.passwordInput,
                      ...(localLoading ? styles.inputDisabled : {}),
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    disabled={localLoading}
                  >
                    {showPassword ? (
                      <EyeOff style={styles.eyeIcon} />
                    ) : (
                      <Eye style={styles.eyeIcon} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={localLoading}
                  className="primary-button-hover"
                  style={{
                    ...styles.primaryButton,
                    ...(localLoading ? styles.buttonDisabled : {}),
                  }}
                >
                  {localLoading ? "Logging in..." : "Login"}
                </button>
              </div>

              <div style={styles.switchContainer}>
                <p style={styles.switchText}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToCreate}
                    disabled={localLoading}
                    className="link-button-hover"
                    style={styles.linkButton}
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Create Account Form
            <form onSubmit={handleCreateAccount}>
              <h1 style={styles.title}>Create an Account</h1>
              <p style={styles.subtitle}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  disabled={localLoading}
                  className="link-button-hover"
                  style={styles.linkButton}
                >
                  Login
                </button>
              </p>

              <div style={styles.formSpace}>
                <div style={styles.nameField}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={localLoading}
                    className="input-focus"
                    style={{
                      ...styles.input,
                      ...(localLoading ? styles.inputDisabled : {}),
                    }}
                  />
                </div>
                <div style={styles.nameField}>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={localLoading}
                    className="input-focus"
                    style={{
                      ...styles.input,
                      ...(localLoading ? styles.inputDisabled : {}),
                    }}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={localLoading}
                    className="input-focus"
                    style={{
                      ...styles.input,
                      ...(localLoading ? styles.inputDisabled : {}),
                    }}
                  />
                </div>

                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={localLoading}
                    className="input-focus"
                    style={{
                      ...styles.input,
                      ...(localLoading ? styles.inputDisabled : {}),
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    disabled={localLoading}
                  >
                    {showPassword ? (
                      <EyeOff style={styles.eyeIcon} />
                    ) : (
                      <Eye style={styles.eyeIcon} />
                    )}
                  </button>
                </div>

                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={styles.checkbox}
                    disabled={localLoading}
                  />
                  <label htmlFor="terms" style={styles.checkboxLabel}>
                    I agree to the{" "}
                    <a href="#" style={styles.termsLink}>
                      Terms & Conditions
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={localLoading || !agreedToTerms}
                  className="primary-button-hover"
                  style={{
                    ...styles.primaryButton,
                    ...(localLoading || !agreedToTerms
                      ? styles.buttonDisabled
                      : {}),
                  }}
                >
                  {localLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>

              <div style={styles.socialSection}>
                <div style={styles.divider}>
                  <div style={styles.dividerLine}></div>
                  <span style={styles.dividerText}>or</span>
                  <div style={styles.dividerLine}></div>
                </div>

                <div style={styles.socialButtons}>
                  <button
                    type="button"
                    style={styles.socialButton}
                    className="social-button-hover"
                    disabled={localLoading}
                  >
                    <svg style={styles.socialIcon} viewBox="0 0 24 24">
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
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    style={styles.socialButton}
                    className="social-button-hover"
                    disabled={localLoading}
                  >
                    <svg
                      style={styles.socialIcon}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Feedback messages */}
          {error && (
            <div style={styles.errorMessage}>
              <p style={styles.messageText}>{error}</p>
            </div>
          )}

          {success && (
            <div style={styles.successMessage}>
              <p style={styles.messageText}>{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  visualSide: {
    flex: "1",
    background:
      "linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%)",
    position: "relative",
    overflow: "hidden",
    display: "none",
  },

  visualBackground: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    opacity: "0.8",
  },

  gradientOrb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    animation: "pulse 4s ease-in-out infinite",
  },

  orb1: {
    top: "25%",
    left: "25%",
    width: "384px",
    height: "384px",
    background: "linear-gradient(45deg, #f97316, #ef4444, #8b5cf6)",
    animationDelay: "0s",
  },

  orb2: {
    bottom: "25%",
    right: "25%",
    width: "320px",
    height: "320px",
    background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)",
    animationDelay: "1s",
  },

  orb3: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "288px",
    height: "288px",
    background: "linear-gradient(45deg, #facc15, #f97316, #ef4444)",
    animationDelay: "0.5s",
  },

  flowingSvg: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100%",
    height: "100%",
  },

  logo: {
    position: "absolute",
    top: "2rem",
    left: "2rem",
    zIndex: "10",
    width: "48px",
    height: "48px",
    background: "white",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoIcon: {
    width: "24px",
    height: "24px",
    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
    borderRadius: "4px",
    transform: "rotate(45deg)",
  },

  formSide: {
    width: "100%",
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "white",
  },

  formContainer: {
    width: "100%",
    maxWidth: "448px",
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    color: "#6b7280",
    background: "none",
    border: "none",
    marginBottom: "1.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "color 0.2s",
  },

  backIcon: {
    width: "20px",
    height: "20px",
    marginRight: "0.5rem",
  },

  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "2rem",
  },

  formSpace: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "1rem",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },

  inputDisabled: {
    opacity: "0.5",
  },

  passwordContainer: {
    position: "relative",
  },

  eyeButton: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  eyeIcon: {
    width: "20px",
    height: "20px",
  },

  primaryButton: {
    width: "100%",
    background: "#4B2C20",
    color: "white",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  buttonDisabled: {
    opacity: "0.5",
    cursor: "not-allowed",
  },

  switchContainer: {
    marginTop: "2rem",
    textAlign: "center",
  },

  switchText: {
    color: "#6b7280",
  },

  linkButton: {
    color: "#7c3aed",
    background: "none",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.2s",
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },

  checkbox: {
    marginTop: "0.25rem",
    width: "1rem",
    height: "1rem",
    accentColor: "#7c3aed",
  },

  checkboxLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    lineHeight: "1.25rem",
  },

  termsLink: {
    color: "#7c3aed",
    textDecoration: "none",
    fontWeight: "500",
  },

  socialSection: {
    marginTop: "2rem",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.5rem",
  },

  dividerLine: {
    flex: "1",
    height: "1px",
    background: "#d1d5db",
  },

  dividerText: {
    padding: "0 0.5rem",
    background: "white",
    color: "#6b7280",
    fontSize: "0.875rem",
  },

  socialButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  },

  socialButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    background: "white",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  socialIcon: {
    width: "20px",
    height: "20px",
    marginRight: "0.5rem",
  },

  errorMessage: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
  },

  successMessage: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
  },

  messageText: {
    fontSize: "0.875rem",
    margin: "0",
    color: "#374151",
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9fafb",
  },

  loadingText: {
    color: "#6b7280",
  },
};

export default LoginPage;
