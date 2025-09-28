import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { authStyles, initAuthStyles } from "../../styles/authStyles";

// Initialize styles
initAuthStyles();

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const navigate = useNavigate();
  const { createAccount, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");
    setSuccess("");

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
            navigate("/login");
          }, 2000);
        } else {
          setSuccess(
            `Account created successfully! Welcome, ${
              result.customer?.firstName || result.customer?.email
            }!`
          );
          setTimeout(() => {
            navigate("/");
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
            background: "linear-gradient(135deg, #ffc800ff 0%, #272100ff 100%)",
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
              Join Our Community
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                opacity: 0.9,
                maxWidth: "400px",
                marginBottom: "2rem",
              }}
            >
              Create an account and unlock exclusive benefits
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                fontSize: "1.1rem",
                textAlign: "left",
              }}
            >
              <li
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ✓ Exclusive member discounts
              </li>
              <li
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ✓ Early access to sales
              </li>
              <li
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ✓ Order tracking & history
              </li>
              <li
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                ✓ Personalized recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={authStyles.formSide}>
        <div style={authStyles.formContainer}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button
              style={authStyles.backButton}
              className="back-button-hover"
              disabled={localLoading}
            >
              <ArrowLeft style={authStyles.backIcon} />
              Back
            </button>
          </Link>

          <form onSubmit={handleCreateAccount}>
            <h1 style={authStyles.title}>Create an Account</h1>
            <p style={authStyles.subtitle}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={authStyles.linkButton}
                className="link-button-hover"
              >
                Login
              </Link>
            </p>

            <div style={authStyles.formSpace}>
              <div style={{ display: "grid" }}>
                <div style={{ display: "flex", gap: "24px" }}>
                  <div style={{ ...authStyles.nameField }}>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={localLoading}
                      className="input-focus"
                      style={{
                        ...authStyles.input,
                        ...(localLoading ? authStyles.inputDisabled : {}),
                      }}
                    />
                  </div>
                  <div style={{ ...authStyles.nameField }}>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={localLoading}
                      className="input-focus"
                      style={{
                        ...authStyles.input,
                        ...(localLoading ? authStyles.inputDisabled : {}),
                      }}
                    />
                  </div>
                </div>
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
                    ...authStyles.input,
                    ...(localLoading ? authStyles.inputDisabled : {}),
                  }}
                />
              </div>

              <div style={authStyles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
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

              <div style={authStyles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  style={authStyles.checkbox}
                  disabled={localLoading}
                />
                <label htmlFor="terms" style={authStyles.checkboxLabel}>
                  I agree to the{" "}
                  <a href="#" style={authStyles.termsLink}>
                    Terms & Conditions
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={localLoading || !agreedToTerms}
                className="primary-button-hover"
                style={{
                  ...authStyles.primaryButton,
                  ...(localLoading || !agreedToTerms
                    ? authStyles.buttonDisabled
                    : {}),
                }}
              >
                {localLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div style={authStyles.socialSection}>
              <div style={authStyles.divider}>
                <div style={authStyles.dividerLine}></div>
                <span style={authStyles.dividerText}>or</span>
                <div style={authStyles.dividerLine}></div>
              </div>

              <div style={authStyles.socialButtons}>
                <button
                  type="button"
                  style={authStyles.socialButton}
                  className="social-button-hover"
                  disabled={localLoading}
                >
                  <svg style={authStyles.socialIcon} viewBox="0 0 24 24">
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
                  style={authStyles.socialButton}
                  className="social-button-hover"
                  disabled={localLoading}
                >
                  <svg
                    style={authStyles.socialIcon}
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

export default SignupPage;
