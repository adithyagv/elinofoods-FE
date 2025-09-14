import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaShoppingBag,
  FaUser,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { HiX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);
  const [isScrolled, setIsScrolled] = useState(false);

  // Map routes to Tailwind background classes (you can adjust colors here)
  const routeBgMap = {
    "/": "bg-white",
    "/products": "bg-amber-50",
    "/profile": "bg-amber-100",
    "/login": "bg-white",
  };

  // compute background class for current route (fallback logic)
  const bgClass =
    routeBgMap[activePath] ||
    routeBgMap[Object.keys(routeBgMap).find((k) => activePath.startsWith(k))] ||
    "bg-white";

  // Mock data - replace with your actual context
  const customer = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  };
  const isAuthenticated = true;
  const getTotalItems = () => 3; // Mock cart items

  // Refs for dropdown management
  const profileDropdownRef = useRef(null);

  const navigate = useNavigate();

  const dropdown = {
    link: ["Bar Blast", "Fruit Jerky"],
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openCart = () => {
    // setIsCartOpen(true);
    console.log("Cart opened");
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
      setShowProfileDropdown(false);
      console.log("Logout clicked");
      // TODO: perform actual logout (clear auth, tokens)
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    if (isAuthenticated && customer) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isScrolled ? bgClass : ""
      }`}
    >
      {/* Outer wrapper to control background + tube effect */}
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out relative max-w-7xl ${
          isScrolled
            ? `${bgClass} shadow-lg rounded-full py-2 px-3 lg:py-2 lg:px-4`
            : "py-0 lg:py-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h4 className="text-xl lg:text-2xl font-bold text-amber-900 hover:text-amber-700 transition-colors duration-200">
                Elino Foods
              </h4>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-amber-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search your products here..."
                  className="w-80 lg:w-96 pl-10 pr-4 py-2 border border-amber-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                           nav-bg shadow-sm transition-all duration-200
                           placeholder-amber-500/70 text-amber-900"
                />
              </div>
            </div>
          </div>

          {/* Center Section - Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-8">
            <a
              href="/"
              className={`relative px-3 py-2 text-lg font-semibold transition-all duration-200 
                         hover:text-amber-600 group ${
                           activePath === "/"
                             ? "text-amber-600"
                             : "text-amber-900"
                         }`}
            >
              Home
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform transition-transform duration-200 
                           ${
                             activePath === "/"
                               ? "scale-x-100"
                               : "scale-x-0 group-hover:scale-x-100"
                           }`}
              />
            </a>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <a
                href="/products"
                className={`relative px-3 py-2 text-lg font-semibold transition-all duration-200 
                           hover:text-amber-600 group flex items-center space-x-1 ${
                             activePath === "/products"
                               ? "text-amber-600"
                               : "text-amber-900"
                           }`}
              >
                <span>Products</span>
                <IoIosArrowDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform transition-transform duration-200 
                             ${
                               activePath === "/products"
                                 ? "scale-x-100"
                                 : "scale-x-0 group-hover:scale-x-100"
                             }`}
                />
              </a>

              {/* Dropdown Content */}
              {showDropdown && (
                <div
                  className={`absolute top-full left-0 mt-2 w-56 rounded-xl shadow-xl border-amber-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${bgClass}`}
                >
                  <div className="p-4">
                    <p className="text-sm font-bold text-amber-900 mb-3">
                      Search by Categories
                    </p>
                    {dropdown.link.map((item, index) => (
                      <a
                        key={index}
                        href={`/products?category=${item
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        className="block px-3 py-2 text-sm text-amber-800 hover:text-amber-600 
                                 hover:bg-amber-50 rounded-lg transition-all duration-150 
                                 transform hover:translate-x-1"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className={`relative px-3 py-2 text-lg font-semibold transition-all duration-200 hover:text-amber-600 group ${
                activePath.startsWith("/blog")
                  ? "text-amber-600"
                  : "text-amber-900"
              }`}
            >
              Blog
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform transition-transform duration-200 ${
                  activePath.startsWith("/blog")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>

            <Link
              to="/about"
              className={`relative px-3 py-2 text-lg font-semibold transition-all duration-200 hover:text-amber-600 group ${
                activePath.startsWith("/about")
                  ? "text-amber-600"
                  : "text-amber-900"
              }`}
            >
              About Us
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 transform transition-transform duration-200 ${
                  activePath.startsWith("/about")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          </div>

          {/* Right Section - Icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Search Button (hidden) */}
            <button className="hidden p-2 text-amber-900 hover:text-amber-600 transition-colors">
              <FaSearch className="h-5 w-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-amber-900 hover:text-amber-600 transition-all duration-200 
                       transform hover:scale-110"
            >
              <FaShoppingBag className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                               rounded-full h-5 w-5 flex items-center justify-center animate-pulse 
                               border-2 border-white shadow-lg"
                >
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 px-3 py-2 text-amber-900 hover:text-amber-600 
                         hover:bg-amber-50 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <FaUserCircle className="h-6 w-6" />
                <span className="hidden sm:block text-sm font-semibold max-w-20 truncate">
                  {isAuthenticated && customer
                    ? customer.firstName || "Account"
                    : "Guest"}
                </span>
                <IoIosArrowDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-xl shadow-xl border border-amber-100 
                             overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${bgClass}`}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4">
                    {isAuthenticated && customer ? (
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-amber-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-sm text-amber-800 opacity-90">
                          {customer.email}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-amber-900">
                        Welcome, Guest!
                      </p>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {isAuthenticated && customer ? (
                      <>
                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center space-x-3 px-6 py-3 text-amber-900 
                                   hover:bg-amber-50 transition-all duration-150 transform hover:translate-x-1"
                        >
                          <FaUser className="h-4 w-4" />
                          <span className="font-medium">View Profile</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-6 py-3 text-red-600 
                                   hover:bg-red-50 transition-all duration-150 transform hover:translate-x-1"
                        >
                          <FaSignOutAlt className="h-4 w-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-amber-900 
                                 hover:bg-amber-50 transition-all duration-150 transform hover:translate-x-1"
                      >
                        <FaUser className="h-4 w-4" />
                        <span className="font-medium">Sign In</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-amber-900 hover:text-amber-600 transition-colors"
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <GiHamburgerMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (hidden) */}
        <div className="hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-amber-600" />
            </div>
            <input
              type="text"
              placeholder="Search your products here..."
              className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                       nav-bg shadow-sm transition-all duration-200
                       placeholder-amber-500/70 text-amber-900"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`lg:hidden border-t border-amber-100 shadow-lg ${bgClass}`}
        >
          <div className="px-4 py-6 space-y-4">
            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
                activePath === "/"
                  ? "text-amber-600 bg-amber-50"
                  : "text-amber-900 hover:text-amber-600 hover:bg-amber-50"
              }`}
            >
              Home
            </a>

            {/* Mobile Products Menu */}
            <div>
              <a
                href="/products"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
                  activePath === "/products"
                    ? "text-amber-600 bg-amber-50"
                    : "text-amber-900 hover:text-amber-600 hover:bg-amber-50"
                }`}
              >
                Products
              </a>
              <div className="ml-4 mt-2 space-y-1">
                {dropdown.link.map((item, index) => (
                  <a
                    key={index}
                    href={`/products?category=${item
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-amber-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-150"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
                activePath.startsWith("/blog")
                  ? "text-amber-600 bg-amber-50"
                  : "text-amber-900 hover:text-amber-600 hover:bg-amber-50"
              }`}
            >
              Blog
            </Link>

            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
                activePath.startsWith("/about")
                  ? "text-amber-600 bg-amber-50"
                  : "text-amber-900 hover:text-amber-600 hover:bg-amber-50"
              }`}
            >
              About Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
