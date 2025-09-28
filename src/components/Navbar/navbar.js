import { useState, useEffect, useRef } from "react";
import "./navbar.css";
import {
  FaUserCircle,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { useCart } from "../CartContext";
import { useAuth } from "../../auth/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);

  // Use AuthContext instead of local customer state
  const { customer, logout, isAuthenticated } = useAuth();

  // Refs for dropdown management
  const profileDropdownRef = useRef(null);

  // Cart functionality
  const { getTotalItems, setIsCartOpen } = useCart();

  const dropdown = {
    link: ["Bar Blast", "Fruit Jerky"],
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      // AuthContext will handle the cleanup
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      setShowProfileDropdown(false);
      window.location.href = "/";
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated && customer) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/login";
    }
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  useEffect(() => {
    const handlePathChange = () => setActivePath(window.location.pathname);
    window.addEventListener("popstate", handlePathChange);
    return () => window.removeEventListener("popstate", handlePathChange);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h4>Elino Foods</h4>
        <div className="search-bar">
          <i className="fa fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search your products here..."
            className="place"
          />
        </div>
      </div>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <a href="/" className={activePath === "/" ? "active" : ""}>
          Home
        </a>

        <div
          className="dropdown-wrapper"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <a
            href="./products"
            className={activePath === "/products" ? "active" : ""}
          >
            Products
            <IoIosArrowDown
              style={{ marginLeft: "5px", position: "relative", top: "3px" }}
              size={16}
            />
          </a>
          {showDropdown && (
            <div className="dropdown-content">
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
              >
                Search by Categories
              </p>
              {dropdown.link.map((item, index) => (
                <a
                  key={index}
                  href={`/products?category=${item
                    .toLowerCase()
                    .replace(" ", "-")}`}
                  className="dropdown-item"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        <a href="/blog" className={activePath.includes("blog") ? "active" : ""}>
          Blog
        </a>
        <a
          href="/about"
          className={activePath.includes("about") ? "active" : ""}
        >
          About Us
        </a>
      </div>

      <div className="nav-icons">
        {/* Cart Button with Badge */}
        <button className="cart-btn" onClick={openCart}>
          <FaShoppingBag />
          {getTotalItems() > 0 && (
            <span className="cart-badge">{getTotalItems()}</span>
          )}
        </button>

        {/* Profile Button with Dropdown */}
        <div className="profile-wrapper" ref={profileDropdownRef}>
          <button className="profile-btn" onClick={toggleProfileDropdown}>
            <FaUserCircle />
            {isAuthenticated && customer ? (
              <span className="profile-name">
                {customer.firstName || "Account"}
              </span>
            ) : (
              <span className="profile-name">Guest</span>
            )}
            <IoIosArrowDown
              className={`profile-arrow ${
                showProfileDropdown ? "rotated" : ""
              }`}
              size={14}
            />
          </button>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                {isAuthenticated && customer ? (
                  <div className="customer-info">
                    <span className="customer-name">
                      {customer.firstName} {customer.lastName}
                    </span>
                    <span className="customer-email">{customer.email}</span>
                  </div>
                ) : (
                  <span className="guest-text">Welcome, Guest!</span>
                )}
              </div>

              <div className="profile-dropdown-divider"></div>

              {isAuthenticated && customer ? (
                <>
                  <button
                    className="profile-dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <FaUser className="dropdown-icon" />
                    View Profile
                  </button>
                  <button
                    className="profile-dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="profile-dropdown-item"
                  onClick={handleProfileClick}
                >
                  <FaUser className="dropdown-icon" />
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
