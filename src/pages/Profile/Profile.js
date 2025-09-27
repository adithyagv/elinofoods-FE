import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaShoppingBag,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth, withAuth } from "../../auth/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { customer, logout, updateCustomer, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);

  // Form data for editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Initialize form data when customer data is available
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
      });
      setOrders(customer.orders?.edges || []);
    }
  }, [customer]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Note: Shopify Storefront API doesn't allow customer updates
      // You would need to implement this in your backend using Admin API
      // For now, we'll just update the local state

      const updatedCustomerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      // Update the context state
      updateCustomer(updatedCustomerData);

      setIsEditing(false);

      // Show success message (you can implement toast notifications)
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    setFormData({
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // AuthContext will handle the cleanup and redirection
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      // Force logout even if API call fails
      window.location.href = "/";
    }
  };

  const formatDate = (dateString) => {

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatPrice = (price) => {
    return `${price.currencyCode} ${parseFloat(price.amount).toFixed(2)}`;
  };

  // Show loading if auth is still loading or if we don't have customer data yet
  if (authLoading || !customer) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
 /*  console.log(orders.map((order)=>(
    order.node
  ))) */

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            <FaUser size={48} />
          </div>
          <div className="profile-header-info">
            <h1>My Profile</h1>
            <p>Welcome back, {customer.firstName || customer.email}!</p>
            <small>
              Member since {formatDate(customer.createdAt || new Date())}
            </small>
          </div>
          <button className="logout-btn-header" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        {/* Personal Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit />
                Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  <FaSave />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  <FaTimes />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="info-row">
              <div className="info-item">
                <FaUser className="info-icon" />
                <div className="info-content">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span>{customer?.firstName || "Not provided"}</span>
                  )}
                </div>
              </div>

              <div className="info-item">
                <FaUser className="info-icon" />
                <div className="info-content">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span>{customer?.lastName || "Not provided"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div className="info-content">
                  <label>Email Address</label>
                  <span className="email-display">{customer?.email}</span>
                  {isEditing && (
                    <small className="email-note">
                      Email cannot be changed
                    </small>
                  )}
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div className="info-content">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <span>{customer?.phone || "Not provided"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <span className="orders-count">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          </div>

          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((orderEdge) => {
                const order = orderEdge.node;
                return (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <div className="order-header">
                        <FaShoppingBag className="order-icon" />
                        <div>
                          <h4>Order #{order.orderNumber}</h4>
                          <p className="order-date">
                            <FaCalendarAlt size={12} />
                            {formatDate(order.processedAt|| new Date())}
                          </p>
                        </div>
                      </div>
                      <div className="order-total">
                        {formatPrice(order.totalPriceV2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-orders">
              <FaShoppingBag size={48} />
              <h3>No orders yet</h3>
              <p>Start shopping to see your order history here</p>
              <button
                className="shop-now-btn"
                onClick={() => (window.location.href = "/products")}
              >
                Shop Now
              </button>
            </div>
          )}
        </div>

        {/* Account Actions Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Account Actions</h2>
          </div>

          <div className="account-actions">
            <button className="action-btn secondary">
              <FaMapMarkerAlt />
              Manage Addresses
            </button>
            <button className="action-btn secondary">
              <FaUser />
              Privacy Settings
            </button>
            <button className="action-btn danger" onClick={handleLogout}>
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
