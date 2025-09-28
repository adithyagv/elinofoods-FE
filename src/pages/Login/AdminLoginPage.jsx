import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Shield, Lock, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authStyles, initAuthStyles } from "../../styles/authStyles";

// Initialize styles
initAuthStyles();

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!requiresTwoFactor) {
        if (username === "admin" && password === "admin123") {
          setRequiresTwoFactor(true);
          setSuccess("Credentials verified. Please enter your 2FA code.");
        } else {
          setError("Invalid admin credentials.");
        }
      } else {
        if (twoFactorCode === "123456") {
          setSuccess("Admin login successful! Redirecting to dashboard...");

          localStorage.setItem("adminToken", "admin-token-here");
          localStorage.setItem(
            "adminUser",
            JSON.stringify({ username, role: "admin" })
          );

          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1500);
        } else {
          setError("Invalid 2FA code. Please try again.");
        }
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div style={authStyles.container}>
      {/* Left Side - Banner Area */}
      <div style={authStyles.visualSide} className="visual-side-responsive">
        {/* Admin-specific banner */}
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
          <div
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            <Shield size={80} style={{ marginBottom: "2rem", opacity: 0.9 }} />
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Admin Control Center
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                opacity: 0.9,
                maxWidth: "400px",
                marginBottom: "3rem",
              }}
            >
              Secure administrative access portal
            </p>

            <div
              style={{
                padding: "1.5rem",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                  fontWeight: "600",
                }}
              >
                Security Features
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  fontSize: "1rem",
                  textAlign: "left",
                }}
              >
                <li
                  style={{
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  🔐 Two-Factor Authentication
                </li>
                <li
                  style={{
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  📊 Real-time Activity Monitoring
                </li>
                <li
                  style={{
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  🛡️ Encrypted Data Transmission
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  📝 Comprehensive Audit Logs
                </li>
              </ul>
            </div>
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
              Back to User Login
            </button>
          </Link>

          <form onSubmit={handleAdminLogin}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              <Shield size={32} color="#7c3aed" />
              <h1 style={{ ...authStyles.title, margin: 0 }}>Admin Portal</h1>
            </div>

            <p style={authStyles.subtitle}>Secure administrative access only</p>

            <div style={authStyles.formSpace}>
              {!requiresTwoFactor ? (
                <>
                  <div>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Admin Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={localLoading}
                        className="input-focus"
                        style={{
                          ...authStyles.input,
                          paddingLeft: "2.5rem",
                          ...(localLoading ? authStyles.inputDisabled : {}),
                        }}
                      />
                      <UserCheck
                        style={{
                          position: "absolute",
                          left: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "20px",
                          height: "20px",
                          color: "#6b7280",
                        }}
                      />
                    </div>
                  </div>

                  <div style={authStyles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Admin Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={localLoading}
                      className="input-focus"
                      style={{
                        ...authStyles.input,
                        paddingLeft: "2.5rem",
                        paddingRight: "3rem",
                        ...(localLoading ? authStyles.inputDisabled : {}),
                      }}
                    />
                    <Lock
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        color: "#6b7280",
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
                </>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit 2FA Code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    disabled={localLoading}
                    className="input-focus"
                    style={{
                      ...authStyles.input,
                      textAlign: "center",
                      fontSize: "1.25rem",
                      letterSpacing: "0.5rem",
                      fontWeight: "600",
                      ...(localLoading ? authStyles.inputDisabled : {}),
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginTop: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    Check your authenticator app for the code
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={localLoading}
                className="admin-button-hover"
                style={{
                  ...authStyles.adminButton,
                  ...(localLoading ? authStyles.buttonDisabled : {}),
                }}
              >
                {localLoading
                  ? requiresTwoFactor
                    ? "Verifying 2FA..."
                    : "Authenticating..."
                  : requiresTwoFactor
                  ? "Verify 2FA Code"
                  : "Login as Admin"}
              </button>

              {requiresTwoFactor && (
                <button
                  type="button"
                  onClick={() => {
                    setRequiresTwoFactor(false);
                    setTwoFactorCode("");
                    setPassword("");
                    setError("");
                    setSuccess("");
                  }}
                  disabled={localLoading}
                  className="link-button-hover"
                  style={{
                    ...authStyles.linkButton,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Use different credentials
                </button>
              )}
            </div>

            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "#fef3c7",
                border: "1px solid #fcd34d",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                }}
              >
                <Shield
                  size={20}
                  color="#f59e0b"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#92400e",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    Security Notice
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#78350f",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    This portal is for authorized administrators only. All login
                    attempts are monitored and logged. Unauthorized access
                    attempts will be reported.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <a
                href="#"
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  textDecoration: "none",
                }}
                className="link-button-hover"
              >
                Forgot admin credentials? Contact IT Support
              </a>
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

export default AdminLoginPage;
