import { useState, useEffect } from "react";
import "./navbar.css";
import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { useCart } from "../CartContext"; // Fixed import path - go up one level

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);

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
                <a key={index} href={`../products`} className="dropdown-item">
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        <a href="#blog" className={activePath.includes("blog") ? "active" : ""}>
          Blog
        </a>
        <a
          href="#about"
          className={activePath.includes("about") ? "active" : ""}
        >
          About Us
        </a>
      </div>

      <div className="nav-icons">
        {/* Updated Cart Button with Badge */}
        <button className="cart-btn" onClick={openCart}>
          <FaShoppingBag />
          {getTotalItems() > 0 && (
            <span className="cart-badge">{getTotalItems()}</span>
          )}
        </button>

        <button className="profile-btn">
          <FaUserCircle />
        </button>
        <button className="hamburger" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
