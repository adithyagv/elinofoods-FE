import React, { createContext, useContext, useState, useEffect } from "react";
import shopifyService from "../services/shopifyService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartId, setCartId] = useState(null); // Updated: using cartId instead of checkoutId
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("elinoCart");
    const savedCartId = localStorage.getItem("elinoCartId"); // Updated key name

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from storage:", error);
      }
    }

    if (savedCartId) {
      setCartId(savedCartId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("elinoCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems((prev) => {
      // Use variant ID for Shopify compatibility
      const existingItem = prev.find((item) => item.variantId === variant.id);

      if (existingItem) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Store all necessary information for cart display and checkout
      return [
        ...prev,
        {
          id: product.id, // Keep product ID for reference
          variantId: variant.id, // Required for Shopify cart
          title: product.title,
          variantTitle: variant.title,
          price: parseFloat(variant.price.amount),
          currencyCode: variant.price.currencyCode,
          image: product.images?.edges[0]?.node?.url || "",
          imageAlt: product.images?.edges[0]?.node?.altText || product.title,
          quantity,
          availableForSale: variant.availableForSale,
          handle: product.handle, // For product page links
        },
      ];
    });
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity === 0) {
      removeFromCart(variantId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    setCartId(null);
    setCheckoutUrl(null);
    localStorage.removeItem("elinoCartId"); // Updated key name
  };

  // Create Shopify cart (updated from checkout)
  const createCheckout = async () => {
    if (cartItems.length === 0) {
      console.warn("Cannot create cart with empty cart");
      return null;
    }

    setIsLoading(true);

    try {
      // Format line items for Shopify Cart API
      const lineItems = cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      console.log("🛒 Creating cart with line items:", lineItems);

      const response = await shopifyService.createCheckout(lineItems);

      console.log("📦 Cart creation response:", response);

      if (response.checkout || response.cart) {
        const cart = response.cart || response.checkout;
        const newCartId = cart.id;
        const newCheckoutUrl = response.checkout?.webUrl || cart.checkoutUrl;

        setCartId(newCartId);
        setCheckoutUrl(newCheckoutUrl);
        localStorage.setItem("elinoCartId", newCartId);

        console.log("✅ Cart created successfully:");
        console.log("🆔 Cart ID:", newCartId);
        console.log("🔗 Checkout URL:", newCheckoutUrl);

        return newCheckoutUrl;
      } else if (response.userErrors?.length > 0) {
        console.error("Cart creation errors:", response.userErrors);
        throw new Error(response.userErrors[0].message);
      } else {
        throw new Error("Invalid response from cart creation");
      }
    } catch (error) {
      console.error("Error creating cart:", error);

      // More specific error handling for Cart API
      if (error.message.includes("Cart creation failed:")) {
        // This is already a formatted error from the service
        throw error;
      } else if (error.response?.status === 400) {
        throw new Error(
          "Invalid cart data. Please check your items and try again."
        );
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(`Failed to create cart: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to Shopify checkout
  const goToCheckout = async () => {
    try {
      setIsLoading(true);
      const url = checkoutUrl || (await createCheckout());
      if (url) {
        console.log("🚀 Redirecting to checkout:", url);
        window.location.href = url;
      } else {
        throw new Error("No checkout URL available");
      }
    } catch (error) {
      console.error("Failed to go to checkout:", error);
      // You can add toast notification or alert here
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart items in Shopify (new method for Cart API)
  const updateCartInShopify = async () => {
    if (!cartId || cartItems.length === 0) {
      console.warn("No cart ID or empty cart - skipping Shopify update");
      return;
    }

    try {
      setIsLoading(true);

      // Map local cart items to Shopify cart lines format
      // Note: This requires that we store the Shopify line item IDs
      // For now, we'll recreate the cart if we need to sync
      console.log("🔄 Syncing cart with Shopify...");

      // For simplicity, recreate the cart
      // In a production app, you'd want to store line item IDs to use updateCartItems
      await createCheckout();
    } catch (error) {
      console.error("Failed to update cart in Shopify:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to existing Shopify cart
  const addToShopifyCart = async (product, variant, quantity = 1) => {
    if (!cartId) {
      console.warn("No cart ID - will create new cart");
      return;
    }

    try {
      setIsLoading(true);

      const lineItems = [
        {
          variantId: variant.id,
          quantity: quantity,
        },
      ];

      await shopifyService.addToCheckout(cartId, lineItems);
      console.log("✅ Item added to Shopify cart");
    } catch (error) {
      console.error("Failed to add item to Shopify cart:", error);
      // Fallback: recreate the entire cart
      console.log("🔄 Falling back to cart recreation");
      await createCheckout();
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    createCheckout,
    goToCheckout,
    checkoutUrl,
    cartId,
    isLoading,
    updateCartInShopify,
    addToShopifyCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
