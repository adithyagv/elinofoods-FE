import { useState, useEffect } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { authStyles, initAuthStyles } from "../../styles/authStyles";

// Initialize styles
initAuthStyles();

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await login(email, password);

      if (result.success) {
        setSuccess(
          `Login successful! Welcome back, ${
            result.customer?.firstName || result.customer?.email
          }!`
        );
        setTimeout(() => {
          navigate("/");
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

  if (authLoading) {
    return (
      <div style={authStyles.loadingContainer}>
        <div style={authStyles.loadingText}>Checking authentication...</div>
      </div>
    );
  }

  return (
    <div style={authStyles.container}>
      {/* Left Side - Banner Area */}
      <div style={authStyles.visualSide} className="visual-side-responsive">
        {/* Add your banner/image/content here */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background:
              "linear-gradient(135deg, #1e293b 0%, #ffc800ff 50%, #1e293b 100%)",
          }}
        >
          {/* Example banner content - Replace with your actual banner */}
          <div
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Elino Foods
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                opacity: 0.9,
                maxWidth: "400px",
              }}
            >
              Discover amazing products and enjoy a seamless shopping experience
            </p>
          </div>

          {/* You can add an image here */}
          {/* <img 
            src="/path-to-your-banner-image.jpg" 
            alt="Banner" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          /> */}
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={authStyles.formSide}>
        <div style={authStyles.formContainer}>
          <form onSubmit={handleLogin}>
            <h1 style={authStyles.title}>Welcome Back</h1>
            <p style={authStyles.subtitle}>Please sign in to your account</p>

            <div style={authStyles.formSpace}>
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
                    ...authStyles.input,
                    ...(localLoading ? authStyles.inputDisabled : {}),
                  }}
                />
              </div>

              <div style={authStyles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={localLoading}
                  className="input-focus"
                  style={{
                    ...authStyles.input,
                    ...authStyles.passwordInput,
                    ...(localLoading ? authStyles.inputDisabled : {}),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={authStyles.eyeButton}
                  disabled={localLoading}
                >
                  {showPassword ? (
                    <EyeOff style={authStyles.eyeIcon} />
                  ) : (
                    <Eye style={authStyles.eyeIcon} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={localLoading}
                className="primary-button-hover"
                style={{
                  ...authStyles.primaryButton,
                  ...(localLoading ? authStyles.buttonDisabled : {}),
                }}
              >
                {localLoading ? "Logging in..." : "Login"}
              </button>

              <div style={authStyles.orDivider}>
                <div style={authStyles.orLine}></div>
                <span style={authStyles.orText}>or</span>
                <div style={authStyles.orLine}></div>
              </div>

              <Link to="/admin/login" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  disabled={localLoading}
                  className="admin-button-hover"
                  style={{
                    ...authStyles.adminButton,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    ...(localLoading ? authStyles.buttonDisabled : {}),
                  }}
                >
                  <Shield size={20} />
                  Admin Login
                </button>
              </Link>
            </div>

            <div style={authStyles.switchContainer}>
              <p style={authStyles.switchText}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={authStyles.linkButton}
                  className="link-button-hover"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>

          {error && (
            <div style={authStyles.errorMessage}>
              <p style={authStyles.messageText}>{error}</p>
            </div>
          )}

          {success && (
            <div style={authStyles.successMessage}>
              <p style={authStyles.messageText}>{success}</p>
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
