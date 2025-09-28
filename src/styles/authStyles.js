// Shared styles for all auth pages
export const authStyles = {
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
    width: "100%",
  },

  input: {
    width: "92%",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "1rem",
    transition: "all 0.2s",
  },

  inputDisabled: {
    opacity: "0.5",
  },

  passwordContainer: {
    width: "93%",
    position: "relative",
  },

  passwordInput: {
    paddingRight: "3rem",
  },

  eyeButton: {
    position: "absolute",
    left: "24.75rem",
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

  secondaryButton: {
    width: "100%",
    background: "#6b7280",
    color: "white",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  adminButton: {
    width: "100%",
    background: "#ffc800ff",
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
    color: "#4B2C20",
    background: "none",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.2s",
  },

  nameField: {
    flex: "1",
    maxWidth: "202px",
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
    accentColor: "#4B2C20",
  },

  checkboxLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    lineHeight: "1.25rem",
  },

  termsLink: {
    color: "#4B2C20",
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

  orDivider: {
    display: "flex",
    alignItems: "center",
    margin: "1.5rem 0",
  },

  orText: {
    padding: "0 1rem",
    color: "#9ca3af",
    fontSize: "0.875rem",
  },

  orLine: {
    flex: "1",
    height: "1px",
    background: "#e5e7eb",
  },
};

// Initialize styles
export const initAuthStyles = () => {
  if (
    typeof document !== "undefined" &&
    !document.head.querySelector("style[data-auth-styles]")
  ) {
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("data-auth-styles", "true");
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
        border-color: #4B2C20;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
      }
      
      .button-hover:hover:not(:disabled) {
        opacity: 0.9;
      }
      
      .primary-button-hover:hover:not(:disabled) {
        background-color: #1f2937 !important;
      }
      
      .secondary-button-hover:hover:not(:disabled) {
        background-color: #4b5563 !important;
      }
      
      .admin-button-hover:hover:not(:disabled) {
        background-color: #ffd335ff !important;
      }
      
      .link-button-hover:hover:not(:disabled) {
        color: #4B2C20 !important;
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
};
