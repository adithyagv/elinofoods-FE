import React, { useState } from "react";
import {
  FaShoppingBag,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useCart } from "../CartContext";
import "./cartSidebar.css";

const CartSidebar = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
    goToCheckout,
    isLoading,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsCartOpen(false);
    }
  };

  const formatPrice = (price, currencyCode = "INR") => {
    // Handle different currency codes
    const currencySymbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const symbol = currencySymbols[currencyCode] || currencyCode;
    return `${symbol}${price.toFixed(2)}`;
  };

  const handleCheckout = async () => {
    console.log(" Checkout button clicked");
    console.log(" Cart items:", cartItems);

    setCheckoutError("");

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty");
      return;
    }

    // Check for valid variant IDs
    const invalidItems = cartItems.filter(
      (item) =>
        !item.variantId ||
        !item.variantId.startsWith("gid://shopify/ProductVariant/")
    );

    if (invalidItems.length > 0) {
      console.error("Invalid cart items found:", invalidItems);
      setCheckoutError(
        "Some items in your cart are invalid. Please refresh and try again."
      );
      return;
    }

    try {
      console.log("🚀 Starting checkout process...");
      await goToCheckout();
      console.log(" Checkout process initiated successfully");
    } catch (error) {
      console.error("Checkout failed:", error);

      // Set user-friendly error message
      if (error.message?.includes("not found")) {
        setCheckoutError(
          "Some products in your cart are no longer available. Please update your cart."
        );
      } else if (error.message?.includes("Server error")) {
        setCheckoutError(
          "Server error occurred. Please try again in a moment."
        );
      } else if (error.message?.includes("Network")) {
        setCheckoutError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setCheckoutError("Unable to proceed to checkout. Please try again.");
      }

      setTimeout(() => setCheckoutError(""), 5000);
    }
  };

  const handleCouponApply = () => {
    // Note: Shopify discount codes are applied at checkout, not in cart
    // This is just for UI feedback
    if (couponCode.trim()) {
      setCouponError("Discount codes will be applied at checkout");
      setTimeout(() => setCouponError(""), 3000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div className="cart-backdrop" onClick={handleBackdropClick} />
      )}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        <div className="cart-content">
          {/* Header */}
          <div className="cart-header">
            <div className="cart-title">
              <FaShoppingBag className="cart-icon" />
              <span>Your cart • {cartItems.length} items</span>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="close-btn">
              <FaTimes />
            </button>
          </div>

          {/* Error Alert */}
          {checkoutError && (
            <div className="error-alert">
              <FaExclamationTriangle />
              <span>{checkoutError}</span>
              <button onClick={() => setCheckoutError("")}>
                <FaTimes />
              </button>
            </div>
          )}

          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <FaShoppingBag className="empty-icon" />
                <p>Your cart is empty</p>
                <button
                  style={{}}
                  onClick={() => setIsCartOpen(false)}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="items-list">
                {cartItems.map((item) => (
                  <div key={item.variantId} className="cart-item">
                    <img
                      src={item.image || "/assets/placeholder.png"}
                      alt={item.imageAlt || item.title}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4 className="item-name">{item.title}</h4>
                      {item.variantTitle &&
                        item.variantTitle !== "Default Title" && (
                          <p className="variant-title">{item.variantTitle}</p>
                        )}

                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="quantity-btn"
                          disabled={!item.availableForSale}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <div className="item-footer">
                        <span className="item-price">
                          {formatPrice(
                            item.price * item.quantity,
                            item.currencyCode
                          )}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="remove-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      {!item.availableForSale && (
                        <p className="out-of-stock-notice">
                          Limited availability
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Only show when items exist */}
          {cartItems.length > 0 && (
            <div className="cart-footer">
              {/* Offers Section */}
              <div className="offers-section">
                <h3>Discount Code</h3>
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter discount code"
                    className="coupon-field"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCouponApply()}
                  />
                  <button
                    onClick={handleCouponApply}
                    className="apply-coupon-btn"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="coupon-message">{couponError}</p>}
              </div>

              {/* Special Offers - You can fetch related products here */}
              <div className="special-offers">
                <h3>You Might Also Like</h3>
                <div className="offers-scroll">
                  {/* These could be fetched from Shopify as recommended products */}
                  <div className="offer-card">
                    <div className="offer-badge">NEW</div>
                    <img
                      src="/assets/logo.png"
                      alt="Product"
                      className="offer-image"
                    />
                    <div className="offer-title">Energy Bar Pack</div>
                    <div className="offer-price">₹432</div>
                    <button className="add-offer-btn">View Product</button>
                  </div>
                  <div className="offer-card">
                    <div className="offer-badge">BESTSELLER</div>
                    <img
                      src="/assets/logo.png"
                      alt="Product"
                      className="offer-image"
                    />
                    <div className="offer-title">Protein Bundle</div>
                    <div className="offer-price">₹756</div>
                    <button className="add-offer-btn">View Product</button>
                  </div>
                </div>
              </div>

              {/* Total and Checkout */}
              <div className="checkout-section">
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal </span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping </span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="total-section">
                  <span className="total-label">Estimated total</span>
                  <span className="total-price">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                <button
                  className={`checkout-btn ${isLoading ? "loading" : ""} ${
                    checkoutError ? "error" : ""
                  }`}
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                >
                  {isLoading ? "Creating Checkout..." : "Proceed to Checkout"}
                </button>

                <div className="checkout-info">
                  <p className="secured-text">🔒 Secure Checkout by Shopify</p>
                  <p className="shipping-note">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
