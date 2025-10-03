import axios from "axios";

const API_BASE_URL ="http://localhost:5000/api" ; //"http://localhost:5000/api";
//"https://elinofoods-be.onrender.com/api"
const API_ENDPOINT = `${API_BASE_URL}`;

const Admin_API_ENDPOINT = "http://localhost:5000/api/shopify/admin";

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
  // SHOPIFY PRODUCT FUNCTIONS - Use API_ENDPOINT

  // Fetch all products
  async getProducts() {
    try {
      console.log("🛍️  Fetching all products...");
      const response = await axios.get(`${API_ENDPOINT}/shopify/products`);
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

  // NEW: Fetch admin products for management (renamed from fetchProducts)
  async fetchAdminProducts() {
    try {
      console.log("🔧 Fetching admin products for management...");

      // Use the admin products endpoint
      const response = await axios.get(
        `${API_ENDPOINT}/shopify/admin/products?limit=50&reverse=true`
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      if (response.data.success && response.data.products) {
        // Transform the data to match component structure
        const transformedProducts = response.data.products.map((product) => ({
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description,
          availableForSale: product.availableForSale,
          price: product.priceRange?.minVariantPrice
            ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(
                2
              )}`
            : "Price not available",
          currencyCode:
            product.priceRange?.minVariantPrice?.currencyCode || "USD",
          image: product.images?.edges?.[0]?.node?.url || null,
          imageAlt: product.images?.edges?.[0]?.node?.altText || product.title,
          variants: product.variants?.edges?.map((edge) => edge.node) || [],
          // Calculate total inventory from variants
          inventory:
            product.variants?.edges?.reduce((total, variant) => {
              return total + (variant.node.availableForSale ? 1 : 0);
            }, 0) || 0,
        }));

        return {
          success: true,
          products: transformedProducts,
          total: transformedProducts.length,
        };
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching admin products:", error);

      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error("Admin products endpoint not found");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error - please try again later");
      } else if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Cannot connect to server. Please ensure the backend is running."
        );
      }

      throw new Error(error.message || "Failed to fetch products");
    }
  },

  // Fetch single product by handle
    async getProduct(handle) {
    console.log("Fetching product for handle:", handle);
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
        `${API_ENDPOINT}/shopify/checkout/create`,
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
        `${API_ENDPOINT}/shopify/checkout/add-items`,
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
        `${API_ENDPOINT}/shopify/checkout/update-items`,
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
        `${API_ENDPOINT}/shopify/test-connection`
      );
      return response.data;
    } catch (error) {
      console.error("Connection test failed:", error);
      throw error;
    }
  },

  // INGREDIENTS MANAGEMENT FUNCTIONS - Use API_BASE_URL directly (no /api prefix)

  // Fetch all ingredients
  async getIngredients() {
    try {
      const url = `${API_BASE_URL}/getingredients`;
      console.log("🥗 Fetching all ingredients from:", url);
      const response = await axios.get(url);

      if (response.data.success) {
        return response.data.ingredients || [];
      } else {
        throw new Error(response.data.error || "Failed to fetch ingredients");
      }
    } catch (error) {
      console.error(
        "Error fetching ingredients:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get ingredients for a specific product
  async getProductIngredients(productId) {
    try {

      const url = `${Admin_API_ENDPOINT}/ingredients/getingredients`;
      console.log(
        `🥗 Fetching ingredients for product ${productId} from:`,
        url
      );
      const response = await axios.get(url);

      if (response.data.success) {
        // Filter ingredients for this specific product
        const ingredients = response.data.ingredients || [];
        const filtered = ingredients.filter(
          (ing) => String(ing.product_id) === String(productId)
        );
        console.log(
          `Found ${filtered.length} ingredients for product ${productId}`
        );
        return filtered;
      } else {
        throw new Error(response.data.error || "Failed to fetch ingredients");
      }
    } catch (error) {
      console.error(
        "Error fetching product ingredients:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Add a new ingredient
  async addIngredient(ingredientData) {
    try {
      const url = `${Admin_API_ENDPOINT}/ingredients/addingredient`;
      console.log("➕ Adding ingredient to:", url);
      console.log("➕ Payload:", ingredientData);
      const response = await axios.post(url, ingredientData);

      if (response.data.success) {
        return response.data.ingredient;
      } else {
        throw new Error(response.data.error || "Failed to add ingredient");
      }
    } catch (error) {
      console.error(
        "Error adding ingredient:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update an ingredient
  async updateIngredient(ingredientId, updateData) {
    try {
      const url = `${Admin_API_ENDPOINT}/ingredients/updateingredient/${encodeURIComponent(
        ingredientId
      )}`;
      console.log(`📝 Updating ingredient at:`, url);
      console.log("📝 Update data:", updateData);
      const response = await axios.put(url, updateData);

      if (response.data.success) {
        return response.data.ingredient;
      } else {
        throw new Error(response.data.error || "Failed to update ingredient");
      }
    } catch (error) {
      console.error(
        "Error updating ingredient:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete an ingredient
  async deleteIngredient(ingredientId) {
    try {
      const url = `${Admin_API_ENDPOINT}/ingredients/deleteingredient/${encodeURIComponent(
        ingredientId
      )}`;
      console.log(`🗑️ Deleting ingredient at:`, url);
      const response = await axios.delete(url);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || "Failed to delete ingredient");
      }
    } catch (error) {
      console.error(
        "Error deleting ingredient:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Generate unique ingredient ID
  generateIngredientId(productId) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ING_${productId}_${timestamp}_${randomStr}`;
  },

  // Helper to clean Shopify product ID
  cleanProductId(id) {
    if (!id) return null;
    // Extract numeric ID from gid://shopify/Product/123456
    if (typeof id === "string" && id.includes("gid://")) {
      const parts = id.split("/");
      return parts[parts.length - 1];
    }
    return id;
  },

  // REVIEW MANAGEMENT FUNCTIONS - Use API_ENDPOINT

  // Fetch reviews for a product
  async getReviews(productId, page = 1, limit = 10, sort = "-createdAt") {
    try {
      console.log(`📝 Fetching reviews for product ${productId}`);

      const response = await axios.get(
        `${API_ENDPOINT}/shopify/reviews/${productId}`,
        {
          params: { page, limit, sort },
        }
      );

      console.log("Reviews fetched:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error(
        "Error fetching reviews:",
        error.response?.data || error.message
      );

      // Provide more helpful error messages
      if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Cannot connect to server. Please ensure the backend is running."
        );
      }

      throw error;
    }
  },

  // Submit a new review
  async submitReview(productId, reviewData) {
    try {
      console.log(`✍️ Submitting review for product ${productId}:`, reviewData);

      // Validate required fields
      if (
        !reviewData.name?.trim() ||
        !reviewData.comment?.trim() ||
        !reviewData.rating
      ) {
        throw new Error("Name, comment, and rating are required");
      }

      const response = await axios.post(
        `${API_ENDPOINT}/shopify/reviews/${productId}`,
        {
          name: reviewData.name.trim(),
          email: reviewData.email?.trim() || "",
          location: reviewData.location?.trim() || "",
          rating: parseInt(reviewData.rating),
          comment: reviewData.comment.trim(),
        }
      );

      console.log("Review submitted:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error(
        "Error submitting review:",
        error.response?.data || error.message
      );

      // Handle validation errors
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }

      throw error;
    }
  },

  // Mark a review as helpful
  async markReviewHelpful(productId, reviewId) {
    try {
      console.log(`👍 Marking review ${reviewId} as helpful`);

      const response = await axios.post(
        `${API_ENDPOINT}/shopify/reviews/${productId}/${reviewId}/helpful`
      );

      console.log("Review marked as helpful:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.error || "Failed to mark review as helpful"
        );
      }
    } catch (error) {
      console.error(
        "Error marking review as helpful:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Report a review
  async reportReview(productId, reviewId, reason) {
    try {
      console.log(`🚨 Reporting review ${reviewId} for: ${reason}`);

      const response = await axios.post(
        `${API_ENDPOINT}/shopify/reviews/${productId}/${reviewId}/report`,
        { reason }
      );

      console.log("Review reported:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to report review");
      }
    } catch (error) {
      console.error(
        "Error reporting review:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getProductRevenue(productId) {
    try {
      console.log(`📊 Fetching revenue for product ${productId}`);
      const response = await axios.get(`${API_ENDPOINT}/revenue`, {
        params: { productId },
      });

      if (response.data.success) {
        return {
          totalRevenue: response.data.totalRevenue || 0,
          orderCount: response.data.orderCount || 0,
          currency: response.data.currency || "USD",
        };
      } else {
        throw new Error(response.data.error || "Failed to fetch revenue data");
      }
    } catch (error) {
      console.error(
        "Error fetching product revenue:",
        error.response?.data || error.message
      );
      // Return default values instead of throwing
      return {
        totalRevenue: 0,
        orderCount: 0,
        currency: "USD",
      };
    }
  },

  async getProductRating(productId) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    try {
      const cleanId = this.cleanProductId(productId);
      console.log("Fetching ratings for product ID:", productId);
      console.log("Cleaned ID:", cleanId);

      const url = `${API_ENDPOINT}/shopify/reviews/${cleanId}/rating`;
      console.log("Rating fetch URL:", url);

      const response = await axios.get(url);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch rating");
      }

      console.log("Rating data received:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product rating:", error);

      // Return default values instead of throwing for UI consistency
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }
  },

  // INGREDIENTS FUNCTIONS (Updated)

  // Fetch ingredients for a specific product (simplified)
  async fetchProductIngredients(productId) {
    if (!productId) {
      console.log("No product ID provided for ingredients");
      return [];
    }

    try {
      console.log("Fetching ingredients for product:", productId);


      const response = await axios.get(`${Admin_API_ENDPOINT}/ingredients/getingredients`);

      if (!response.data.success || !response.data.ingredients) {
        console.log("No ingredients data received");
        return [];
      }

      // Extract clean product ID from Shopify GID
      const cleanProductId = this.cleanProductId(productId);

      // Filter ingredients for this specific product
      const productIngredients = response.data.ingredients.filter((ing) => {
        return String(ing.product_id) === String(cleanProductId);
      });

      console.log(
        `Product ID: ${cleanProductId}, Found ${productIngredients.length} ingredients`
      );

      if (productIngredients.length > 0) {
        // Format ingredients for UI consumption
        return productIngredients.map((ing) => ({
          name: ing.ingredient_name,
          image: ing.ingredient_image || "/assets/placeholder.png",
          id: ing.ingredient_id,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      return [];
    }
  },

  // Get review statistics for a product
  async getReviewStats(productId) {
    try {
      console.log(`📊 Fetching review stats for product ${productId}`);

      const response = await axios.get(
        `${API_ENDPOINT}/shopify/reviews/${productId}/stats`
      );

      console.log("Review stats fetched:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to fetch review stats");
      }
    } catch (error) {
      console.error(
        "Error fetching review stats:",
        error.response?.data || error.message
      );
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

// Export new admin products function
export const fetchAdminProducts = shopifyService.fetchAdminProducts;

// Export ingredient functions
export const getIngredients = shopifyService.getIngredients;
export const getProductIngredients = shopifyService.getProductIngredients;
export const addIngredient = shopifyService.addIngredient;
export const updateIngredient = shopifyService.updateIngredient;
export const deleteIngredient = shopifyService.deleteIngredient;
export const generateIngredientId = shopifyService.generateIngredientId;
export const cleanProductId = shopifyService.cleanProductId;

// Export review functions
export const getReviews = shopifyService.getReviews;
export const submitReview = shopifyService.submitReview;
export const markReviewHelpful = shopifyService.markReviewHelpful;
export const reportReview = shopifyService.reportReview;
export const getReviewStats = shopifyService.getReviewStats;

export const getProductRating = shopifyService.getProductRating;
export const fetchProductIngredients = shopifyService.fetchProductIngredients;

export const getProductRevenue = shopifyService.getProductRevenue;

// Default export
export default shopifyService;
