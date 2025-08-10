import axios from "axios";

const API_BASE_URL =
  "https://elinofoods-be.onrender.com/api" || "http://localhost:5000/api";

// Add axios interceptor for better debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(
      `❌ Error from ${error.config?.url}:`,
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

const shopifyService = {
  // Fetch all products
  async getProducts() {
    try {
      console.log("🛍️  Fetching all products...");
      const response = await axios.get(`${API_BASE_URL}/shopify/products`);
      console.log("Fetched Products: ", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Fetch single product by handle
  async getProduct(handle) {
    try {
      console.log(`🎯 Fetching product with handle: ${handle}`);
      const url = `${API_BASE_URL}/shopify/products/${handle}`;
      console.log(`🔗 Full URL: ${url}`);

      const response = await axios.get(url);
      console.log(`📦 Raw Response Status:`, response.status);
      console.log(`📦 Raw Response Data:`, response.data);
      console.log(
        `📦 Response Type:`,
        Array.isArray(response.data) ? "Array" : "Object"
      );

      let productData = response.data;

      // If we get an array (wrong endpoint or backend issue)
      if (Array.isArray(productData)) {
        console.error(
          "❌ BACKEND ERROR: Received array instead of single product object"
        );
        console.error(
          "❌ This means your backend /products/:handle route is wrong"
        );
        console.error("❌ Array content:", productData);

        // Try to extract the product from array as fallback
        if (productData.length > 0) {
          const firstItem = productData[0];
          // Check if it has a 'node' property (GraphQL edge structure)
          if (firstItem.node) {
            console.warn("🔄 Extracting product from GraphQL edge structure");
            productData = firstItem.node;
          } else {
            console.warn("🔄 Using first item from array");
            productData = firstItem;
          }
          console.log("🔄 Extracted product:", productData);
        } else {
          throw new Error("Empty array response from backend");
        }
      }

      // Validate the product data structure
      if (!productData || typeof productData !== "object") {
        throw new Error("Invalid product data: not an object");
      }

      if (!productData.id || !productData.title) {
        console.error("❌ Invalid product structure:", productData);
        throw new Error(
          "Invalid product data: missing required fields (id, title)"
        );
      }

      console.log(`✅ Valid Product Data:`, {
        id: productData.id,
        title: productData.title,
        handle: productData.handle,
        hasImages: !!productData.images?.edges?.length,
        hasVariants: !!productData.variants?.edges?.length,
      });

      return productData;
    } catch (error) {
      console.error(`❌ Error fetching product (${handle}):`, error);

      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
      }

      // More specific error handling
      if (error.response?.status === 404) {
        throw new Error(`Product "${handle}" not found`);
      } else if (error.response?.status >= 500) {
        throw new Error("Server error - please try again later");
      }

      throw error;
    }
  },

  // Create a cart (updated from checkout)
  async createCheckout(lineItems) {
    try {
      console.log("🛒 Creating cart with items:", lineItems);

      // Validate line items format
      const validatedLineItems = lineItems.map((item) => {
        if (!item.variantId || !item.quantity) {
          throw new Error("Each line item must have variantId and quantity");
        }

        return {
          variantId: item.variantId,
          quantity: parseInt(item.quantity),
        };
      });

      const response = await axios.post(
        `${API_BASE_URL}/shopify/checkout/create`,
        { lineItems: validatedLineItems }
      );

      console.log("Cart Created:", response.data);

      // The backend returns both checkout (for compatibility) and cart data
      const result = response.data;

      // Ensure we have a checkout URL
      if (!result.checkout?.webUrl && !result.cart?.checkoutUrl) {
        throw new Error("No checkout URL returned from server");
      }

      return {
        ...result,
        // Ensure webUrl is available for compatibility
        checkout: {
          ...result.checkout,
          webUrl: result.checkout?.webUrl || result.cart?.checkoutUrl,
        },
      };
    } catch (error) {
      console.error(
        "Error creating cart:",
        error.response?.data || error.message
      );

      // Handle specific Cart API errors
      if (error.response?.data?.userErrors) {
        const userErrors = error.response.data.userErrors;
        const errorMessages = userErrors.map((err) => err.message).join(", ");
        throw new Error(`Cart creation failed: ${errorMessages}`);
      }

      throw error;
    }
  },

  // Add items to an existing cart (updated)
  async addToCheckout(cartId, lineItems) {
    try {
      console.log(`➕ Adding items to cart ${cartId}:`, lineItems);

      const validatedLineItems = lineItems.map((item) => ({
        variantId: item.variantId,
        quantity: parseInt(item.quantity),
      }));

      const response = await axios.post(
        `${API_BASE_URL}/shopify/checkout/add-items`,
        {
          checkoutId: cartId, // Backend expects checkoutId for compatibility
          lineItems: validatedLineItems,
        }
      );

      console.log("Items Added to Cart:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );

      if (error.response?.data?.userErrors) {
        const userErrors = error.response.data.userErrors;
        const errorMessages = userErrors.map((err) => err.message).join(", ");
        throw new Error(`Failed to add items: ${errorMessages}`);
      }

      throw error;
    }
  },

  // Update cart items (new method for Cart API)
  async updateCartItems(cartId, lines) {
    try {
      console.log(`📝 Updating cart items for ${cartId}:`, lines);

      const response = await axios.post(
        `${API_BASE_URL}/shopify/checkout/update-items`,
        {
          cartId,
          lines: lines.map((line) => ({
            id: line.id,
            quantity: parseInt(line.quantity),
          })),
        }
      );

      console.log("Cart Items Updated:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating cart:",
        error.response?.data || error.message
      );

      if (error.response?.data?.userErrors) {
        const userErrors = error.response.data.userErrors;
        const errorMessages = userErrors.map((err) => err.message).join(", ");
        throw new Error(`Failed to update cart: ${errorMessages}`);
      }

      throw error;
    }
  },

  // Test connection
  async testConnection() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shopify/test-connection`
      );
      return response.data;
    } catch (error) {
      console.error("Connection test failed:", error);
      throw error;
    }
  },
};

// Export individual functions
export const getProducts = shopifyService.getProducts;
export const getProduct = shopifyService.getProduct;
export const createCheckout = shopifyService.createCheckout;
export const addToCheckout = shopifyService.addToCheckout;
export const updateCartItems = shopifyService.updateCartItems;
export const testConnection = shopifyService.testConnection;

// Default export
export default shopifyService;
