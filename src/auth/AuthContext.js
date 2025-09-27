// AuthContext.js - Centralized Authentication Management
import React, { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

const AuthContext = createContext();

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  CHECK_AUTH_START: "CHECK_AUTH_START",
  CHECK_AUTH_SUCCESS: "CHECK_AUTH_SUCCESS",
  CHECK_AUTH_FAILURE: "CHECK_AUTH_FAILURE",
  UPDATE_CUSTOMER: "UPDATE_CUSTOMER",
};

// Initial state
const initialState = {
  isAuthenticated: false,
  customer: null,
  token: null,
  loading: true,
  error: null,
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.CHECK_AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        customer: action.payload.customer,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.CHECK_AUTH_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        customer: null,
        token: null,
        loading: false,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case AUTH_ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customer: { ...state.customer, ...action.payload },
      };

    default:
      return state;
  }
}

// AuthProvider Component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const API_URL =
   /*  "https://elinofoods-be.onrender.com/api" || */ "http://localhost:5000/api";

  // Check authentication on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verify token and get customer data
  const verifyToken = async (token) => {
    try {
      const response = await axios.post(`${API_URL}/shopify/customer/me`, {
        token: token,
      });

      if (response.data.success) {
        return response.data.customer;
      }
      return null;
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  };

  // Check if user is already authenticated
  const checkAuthStatus = async () => {
    dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_START });

    try {
      const token = localStorage.getItem("shopify_token");
      const expiresAt = localStorage.getItem("shopify_token_expires");

      if (!token) {
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_FAILURE,
          payload: { error: "No token found" },
        });
        return;
      }

      // Check if token is expired
      if (expiresAt && new Date(expiresAt) < new Date()) {
        console.log("Token expired");
        clearAuthData();
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_FAILURE,
          payload: { error: "Token expired" },
        });
        return;
      }

      // Verify token with server
      const customer = await verifyToken(token);

      if (customer) {
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_SUCCESS,
          payload: { customer, token },
        });
      } else {
        clearAuthData();
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_FAILURE,
          payload: { error: "Invalid token" },
        });
      }
    } catch (error) {
      clearAuthData();
      dispatch({
        type: AUTH_ACTIONS.CHECK_AUTH_FAILURE,
        payload: { error: error.message },
      });
    }
  };

  // Login function
  const login = async (email, password) => {
    console.log("credentials: ",email, password)
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await axios.post(`${API_URL}/shopify/login`, {
        email,
        password,
      });

      const { accessToken, expiresAt } = response.data;

      // Verify token and get customer data
      const customer = await verifyToken(accessToken);

      if (customer) {
        // Save to localStorage
        localStorage.setItem("shopify_token", accessToken);
        localStorage.setItem("shopify_token_expires", expiresAt);
        localStorage.setItem("shopify_user_email", email);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { customer, token: accessToken },
        });

        return { success: true, customer };
      } else {
        throw new Error("Failed to verify login");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      return { success: false, error: errorMessage };
    }
  };

  // Create account function
  const createAccount = async (email, password, firstName, lastName) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await axios.post(`${API_URL}/shopify/create-account`, {
        email,
        password,
        firstName,
        lastName,
      });

      if (response.data.accessToken) {
        const { accessToken, expiresAt, customer } = response.data;

        // Save to localStorage
        localStorage.setItem("shopify_token", accessToken);
        localStorage.setItem("shopify_token_expires", expiresAt);
        localStorage.setItem("shopify_user_email", email);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { customer, token: accessToken },
        });

        return { success: true, customer };
      } else {
        return { success: true, requiresLogin: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("shopify_token");
      if (token) {
        await axios.post(`${API_URL}/shopify/customer/logout`, { token });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAuthData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update customer data
const updateCustomer = async (customerData) => {
  try {

    const response = await fetch(`${API_URL}/shopify/admin/customer/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const result = await response.json();

    if (result.success) {
      // Update context with Shopify's updated customer data
      dispatch({
        type: AUTH_ACTIONS.UPDATE_CUSTOMER,
        payload: result.customer,
      });
      return { success: true, customer: result.customer };
    } else {
      return { success: false, error: result.error || "Update failed" };
    }
  } catch (error) {
    console.error("❌ Error updating customer:", error);
    return { success: false, error: error.message };
  }
};

  // Clear auth data from localStorage
  const clearAuthData = () => {
    localStorage.removeItem("shopify_token");
    localStorage.removeItem("shopify_token_expires");
    localStorage.removeItem("shopify_user_email");
  };

  // Refresh authentication status
  const refreshAuth = () => {
    checkAuthStatus();
  };

  const value = {
    ...state,
    login,
    createAccount,
    logout,
    updateCustomer,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC for protected routes
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <div>Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = "/login";
      return null;
    }

    return <Component {...props} />;
  };
}
