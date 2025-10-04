import axios from "axios";

const API_BASE_URL = "https://elinofoods-be.onrender.com/api";
const API_ENDPOINT = `${API_BASE_URL}`;

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
  // SHOPIFY PRODUCT FUNCTIONS

  // Fetch all products with optional category filter
  async getProducts(options = {}) {
    try {
      const {
        category,
        limit = 50,
        sortKey = "UPDATED_AT",
        reverse = true,
      } = options;

      console.log("🛍️ Fetching products...", options);

      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        sortKey,
        reverse: reverse.toString(),
      });

      // Add category if provided
      if (category) {
        params.append("category", category);
        console.log(`🏷️ Filtering by category: ${category}`);
      }

      const url = `${API_ENDPOINT}/shopify/products?${params.toString()}`;
      const response = await axios.get(url);

      console.log(
        `✅ Fetched ${response.data.length || 0} products${
          category ? ` for category: ${category}` : ""
        }`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Fetch products by category
  async getProductsByCategory(category) {
    try {
      console.log(`🏷️ Fetching products for category: ${category}`);
      return await this.getProducts({ category, limit: 100 });
    } catch (error) {
      console.error(
        `Error fetching products for category ${category}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getProductById(productId) {
    console.log("Fetching product by ID:", productId);
    try {
      const cleanId = this.cleanProductId(productId);
      console.log(`🎯 Fetching product with ID: ${cleanId}`);

      // Use the /id/ endpoint specifically for numeric IDs
      const url = `${API_BASE_URL}/shopify/products/id/${cleanId}`;
      console.log(`🔗 Full URL: ${url}`);

      const response = await axios.get(url);
      console.log(`📦 Product fetched successfully:`, response.data);

      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching product by ID (${productId}):`, error);

      if (error.response?.status === 404) {
        throw new Error(`Product with ID "${productId}" not found`);
      } else if (error.response?.status >= 500) {
        throw new Error("Server error - please try again later");
      }

      throw error;
    }
  },

  async getProduct(handle) {
    console.log("Fetching product:", handle);
    try {
      // First, check if the handle is actually a numeric ID
      if (/^\d+$/.test(handle)) {
        console.log("Handle appears to be numeric ID, using getProductById");
        return await this.getProductById(handle);
      }

      console.log(`🎯 Fetching product with handle: ${handle}`);

      // Use the /handle/ endpoint specifically for handles
      const url = `${API_BASE_URL}/shopify/products/handle/${handle}`;
      console.log(`🔗 Full URL: ${url}`);

      const response = await axios.get(url);
      console.log(`📦 Product fetched successfully:`, response.data);

      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching product (${handle}):`, error);

      if (error.response?.status === 404) {
        // If handle fails, try as ID as fallback
        if (!handle.includes("-")) {
          console.log("Handle fetch failed, trying as ID...");
          return await this.getProductById(handle);
        }
        throw new Error(`Product "${handle}" not found`);
      } else if (error.response?.status >= 500) {
        throw new Error("Server error - please try again later");
      }

      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm, limit = 10) {
    try {
      console.log(`🔍 Searching products for: ${searchTerm}`);

      const params = new URLSearchParams({
        q: searchTerm,
        limit: limit.toString(),
      });

      const url = `${API_ENDPOINT}/shopify/products/search?${params.toString()}`;
      const response = await axios.get(url);

      console.log(`✅ Search returned ${response.data.length || 0} products`);
      return response.data;
    } catch (error) {
      console.error(
        "Error searching products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Quick products fetch (cached on backend)
  async getQuickProducts() {
    try {
      console.log("⚡ Fetching quick products (cached)");
      const response = await axios.get(
        `${API_ENDPOINT}/shopify/products/quick`
      );
      console.log(`✅ Fetched ${response.data.length || 0} quick products`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching quick products:",
        error.response?.data || error.message
      );
      // Fallback to regular products if quick endpoint fails
      console.log("Falling back to regular products fetch");
      return this.getProducts({ limit: 20 });
    }
  },

  // Batch fetch products by IDs or handles
  async batchFetchProducts(identifiers, type = "id") {
    try {
      console.log(
        `📦 Batch fetching ${identifiers.length} products by ${type}`
      );

      const response = await axios.post(
        `${API_ENDPOINT}/shopify/products/batch`,
        {
          identifiers,
          type, // 'id' or 'handle'
        }
      );

      console.log(`✅ Batch fetched ${response.data.length || 0} products`);
      return response.data;
    } catch (error) {
      console.error(
        "Error batch fetching products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // NEW: Fetch admin products for management
  async fetchAdminProducts() {
    try {
      console.log("🔧 Fetching admin products for management...");

      const response = await axios.get(
        `${API_ENDPOINT}/shopify/admin/products?limit=50&reverse=true`
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      if (response.data.success && response.data.products) {
        const transformedProducts = response.data.products.map((product) => ({
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description,
          availableForSale: product.availableForSale,
          productType: product.productType,
          tags: product.tags,
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

  // Helper to clean Shopify product ID
  cleanProductId(id) {
    if (!id) return null;

    // Convert to string
    id = String(id);

    // Extract numeric ID from gid://shopify/Product/123456
    if (id.includes("gid://")) {
      const parts = id.split("/");
      return parts[parts.length - 1];
    }

    // Remove any non-numeric characters if it's supposed to be a numeric ID
    if (/^\d+$/.test(id)) {
      return id;
    }

    return id;
  },

  // Create a cart (updated from checkout)
  async createCheckout(lineItems) {
    try {
      console.log("🛒 Creating cart with items:", lineItems);

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

      const result = response.data;

      if (!result.checkout?.webUrl && !result.cart?.checkoutUrl) {
        throw new Error("No checkout URL returned from server");
      }

      return {
        ...result,
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

      if (error.response?.data?.userErrors) {
        const userErrors = error.response.data.userErrors;
        const errorMessages = userErrors.map((err) => err.message).join(", ");
        throw new Error(`Cart creation failed: ${errorMessages}`);
      }

      throw error;
    }
  },

  // Add items to an existing cart
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
          checkoutId: cartId,
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

  // Update cart items
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

  // ... rest of your existing methods (ingredients, reviews, etc.) remain the same ...

  // INGREDIENTS MANAGEMENT FUNCTIONS
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

  async getProductIngredients(productId) {
    try {
      const url = `${API_BASE_URL}/shopify/admin/ingredients/getingredients`;
      console.log(
        `🥗 Fetching ingredients for product ${productId} from:`,
        url
      );
      const response = await axios.get(url);

      if (response.data.success) {
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

  async addIngredient(ingredientData) {
    try {
      const url = `${API_BASE_URL}/shopify/admin/ingredients/addingredient`;
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

  async updateIngredient(ingredientId, updateData) {
    try {
      const url = `${API_BASE_URL}/shopify/admin/ingredients/updateingredient/${encodeURIComponent(
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

  async deleteIngredient(ingredientId) {
    try {
      const url = `${API_BASE_URL}/shopify/admin/ingredients/deleteingredient/${encodeURIComponent(
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

  generateIngredientId(productId) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ING_${productId}_${timestamp}_${randomStr}`;
  },

  // REVIEW MANAGEMENT FUNCTIONS
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

  async submitReview(productId, reviewData) {
    try {
      console.log(`✍️ Submitting review for product ${productId}:`, reviewData);

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

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }

      throw error;
    }
  },

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

      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }
  },

  async fetchProductIngredients(productId) {
    if (!productId) {
      console.log("No product ID provided for ingredients");
      return [];
    }

    try {
      console.log("Fetching ingredients for product:", productId);

      const response = await axios.get(
        `${API_ENDPOINT}/shopify/admin/ingredients/getingredients`
      );

      if (!response.data.success || !response.data.ingredients) {
        console.log("No ingredients data received");
        return [];
      }

      const cleanProductId = this.cleanProductId(productId);

      const productIngredients = response.data.ingredients.filter((ing) => {
        return String(ing.product_id) === String(cleanProductId);
      });

      console.log(
        `Product ID: ${cleanProductId}, Found ${productIngredients.length} ingredients`
      );

      if (productIngredients.length > 0) {
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
export const getProducts = shopifyService.getProducts.bind(shopifyService);
export const getProductsByCategory =
  shopifyService.getProductsByCategory.bind(shopifyService);
export const getProduct = shopifyService.getProduct.bind(shopifyService);
export const getProductById =
  shopifyService.getProductById.bind(shopifyService);
export const searchProducts =
  shopifyService.searchProducts.bind(shopifyService);
export const getQuickProducts =
  shopifyService.getQuickProducts.bind(shopifyService);
export const batchFetchProducts =
  shopifyService.batchFetchProducts.bind(shopifyService);
export const createCheckout =
  shopifyService.createCheckout.bind(shopifyService);
export const addToCheckout = shopifyService.addToCheckout.bind(shopifyService);
export const updateCartItems =
  shopifyService.updateCartItems.bind(shopifyService);
export const testConnection =
  shopifyService.testConnection.bind(shopifyService);
export const fetchAdminProducts =
  shopifyService.fetchAdminProducts.bind(shopifyService);
export const cleanProductId =
  shopifyService.cleanProductId.bind(shopifyService);

// Export ingredient functions
export const getIngredients =
  shopifyService.getIngredients.bind(shopifyService);
export const getProductIngredients =
  shopifyService.getProductIngredients.bind(shopifyService);
export const addIngredient = shopifyService.addIngredient.bind(shopifyService);
export const updateIngredient =
  shopifyService.updateIngredient.bind(shopifyService);
export const deleteIngredient =
  shopifyService.deleteIngredient.bind(shopifyService);
export const generateIngredientId =
  shopifyService.generateIngredientId.bind(shopifyService);

// Export review functions
export const getReviews = shopifyService.getReviews.bind(shopifyService);
export const submitReview = shopifyService.submitReview.bind(shopifyService);
export const markReviewHelpful =
  shopifyService.markReviewHelpful.bind(shopifyService);
export const reportReview = shopifyService.reportReview.bind(shopifyService);
export const getReviewStats =
  shopifyService.getReviewStats.bind(shopifyService);
export const getProductRating =
  shopifyService.getProductRating.bind(shopifyService);
export const fetchProductIngredients =
  shopifyService.fetchProductIngredients.bind(shopifyService);
export const getProductRevenue =
  shopifyService.getProductRevenue.bind(shopifyService);

// Default export
export default shopifyService;
