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
  FaHome,
  FaGlobe,
  FaCity,
} from "react-icons/fa";
import { useAuth, withAuth } from "../../auth/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { customer, logout, updateCustomer, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showAddressSection, setShowAddressSection] = useState(false);
  const [orders, setOrders] = useState([]);

  // Form data for editing profile
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Form data for editing address
  const [addressData, setAddressData] = useState({
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "",
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
      
      // Initialize address data
      if (customer.defaultAddress) {
        setAddressData({
          address1: customer.defaultAddress.address1 || "",
          address2: customer.defaultAddress.address2 || "",
          city: customer.defaultAddress.city || "",
          province: customer.defaultAddress.province || "",
          zip: customer.defaultAddress.zip || "",
          country: customer.defaultAddress.country || "",
        });
      }
      
      setOrders(customer.orders?.edges || []);
    }
  }, [customer]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const updatedCustomerData = {
        id: customer.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      const result = await updateCustomer(updatedCustomerData);

      if (result.success) {
        alert("Profile updated successfully!");
        window.location.reload(); 
        setIsEditing(false);
      } else {
        alert("Failed to update profile: " + result.error);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);

      // Prepare the updated customer data with address information
      const updatedCustomerData = {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        defaultAddress: {
          id: customer.defaultAddress?.id,
          address1: addressData.address1,
          address2: addressData.address2,
          city: addressData.city,
          province: addressData.province,
          zip: addressData.zip,
          country: addressData.country,
        }
      };

      const result = await updateCustomer(updatedCustomerData);

      if (result.success) {
        alert("Address updated successfully!");
        window.location.reload(); 
        setIsEditingAddress(false);
        setShowAddressSection(false);
      } else {
        alert("Failed to update address: " + result.error);
      }
      
    } catch (err) {
      console.error("Error updating address:", err);
      alert("Failed to update address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Alternative approach: Combined save for both profile and address
  const handleSaveAll = async () => {
    try {
      setLoading(true);

      const updatedCustomerData = {
        id: customer.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        defaultAddress: {
          id: customer.defaultAddress?.id,
          address1: addressData.address1,
          address2: addressData.address2,
          city: addressData.city,
          province: addressData.province,
          zip: addressData.zip,
          country: addressData.country,
        }
      };

      const result = await updateCustomer(updatedCustomerData);

      if (result.success) {
        alert("Profile and address updated successfully!");
        window.location.reload(); 
        setIsEditing(false);
        setIsEditingAddress(false);
        setShowAddressSection(false);
      } else {
        alert("Failed to update: " + result.error);
      }
    } catch (err) {
      console.error("Error updating customer data:", err);
      alert("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    });
    setIsEditing(false);
  };

  const handleCancelAddressEdit = () => {
    if (customer?.defaultAddress) {
      setAddressData({
        address1: customer.defaultAddress.address1 || "",
        address2: customer.defaultAddress.address2 || "",
        city: customer.defaultAddress.city || "",
        province: customer.defaultAddress.province || "",
        zip: customer.defaultAddress.zip || "",
        country: customer.defaultAddress.country || "",
      });
    }
    setIsEditingAddress(false);
    setShowAddressSection(false);
  };

  const handleManageAddresses = () => {
    setShowAddressSection(true);
    setIsEditingAddress(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
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

        {/* Address Information Card - Only show when showAddressSection is true */}
        {showAddressSection && (
        <div className="profile-card">
          <div className="card-header">
            <h2>Default Address</h2>
            <div className="edit-actions">
              <button
                className="save-btn"
                onClick={handleSaveAddress}
                disabled={loading}
              >
                <FaSave />
                {loading ? "Saving..." : "Save"}
              </button>
              <button className="cancel-btn" onClick={handleCancelAddressEdit}>
                <FaTimes />
                Cancel
              </button>
            </div>
          </div>

          <div className="profile-info">
            <div className="info-row">
              <div className="info-item">
                <FaHome className="info-icon" />
                <div className="info-content">
                  <label>Address Line 1</label>
                  <input
                    type="text"
                    name="address1"
                    value={addressData.address1}
                    onChange={handleAddressChange}
                    className="edit-input"
                    placeholder="Enter address line 1"
                  />
                </div>
              </div>

              <div className="info-item">
                <FaHome className="info-icon" />
                <div className="info-content">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="address2"
                    value={addressData.address2}
                    onChange={handleAddressChange}
                    className="edit-input"
                    placeholder="Enter address line 2 (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                <FaCity className="info-icon" />
                <div className="info-content">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    className="edit-input"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="info-content">
                  <label>State/Province</label>
                  <input
                    type="text"
                    name="province"
                    value={addressData.province}
                    onChange={handleAddressChange}
                    className="edit-input"
                    placeholder="Enter state/province"
                  />
                </div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="info-content">
                  <label>ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={addressData.zip}
                    onChange={handleAddressChange}
                    className="edit-input"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>

              <div className="info-item">
                <FaGlobe className="info-icon" />
                <div className="info-content">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressChange}
                    className="edit-input"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

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
            <button 
              className="action-btn secondary"
              onClick={handleManageAddresses}
            >
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