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

export default LoginPage;
