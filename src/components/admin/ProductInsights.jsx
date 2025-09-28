import { useState, useEffect } from "react";
import { ArrowLeft, Loader, AlertCircle } from "lucide-react";
import ProductStats from "./ProductStats";
import ProductDetails from "./ProductDetails";
import ProductVariants from "./ProductVariants";
import IngredientsSection from "./IngredientSection";
import shopifyService from "../../services/shopifyService";

const ProductInsights = ({ productId, productHandle, onBack }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductDetails = async () => {
    if (!productHandle) {
      setError("No product handle provided");
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Use shopifyService to fetch product details
      console.log(`Fetching product details for handle: ${productHandle}`);
      const shopifyProduct = await shopifyService.getProduct(productHandle);

      if (!shopifyProduct || !shopifyProduct.title) {
        throw new Error("Invalid product data received");
      }

      // Get clean product ID using the service helper
      const cleanProductId = shopifyService.cleanProductId(shopifyProduct.id);

      // Transform the product data
      const transformedProduct = {
        ...shopifyProduct,
        title: shopifyProduct.title,
        id: shopifyProduct.id,
        cleanId: cleanProductId, // Store the clean numeric ID
        handle: shopifyProduct.handle,
        status: shopifyProduct.availableForSale ? "Active" : "Inactive",
        price: shopifyProduct.priceRange?.minVariantPrice
          ? `$${parseFloat(
              shopifyProduct.priceRange.minVariantPrice.amount
            ).toFixed(2)}`
          : "Price not available",
        images:
          shopifyProduct.images?.edges?.map((edge) => edge.node.url) || [],
        variants:
          shopifyProduct.variants?.edges?.map((edge) => ({
            id: edge.node.id,
            title: edge.node.title,
            price: `$${parseFloat(edge.node.price.amount).toFixed(2)}`,
            sku: edge.node.sku || "N/A",
            availableForSale: edge.node.availableForSale,
            inventory: edge.node.availableForSale ? "In Stock" : "Out of Stock",
          })) || [],
        vendor: "Your Store",
        productType: "General",
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
        totalSales: 0,
        revenue: "$0.00",
        // Initialize with default values - will be updated
        averageRating: 0,
        totalReviews: 0,
        currentInventory: 0,
        monthlyGrowth: 0,
      };

      setProduct(transformedProduct);

      // Fetch reviews/ratings data using the clean product ID
      if (cleanProductId) {
        fetchReviewsData(cleanProductId);
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews data using shopifyService
  const fetchReviewsData = async (productId) => {
    try {
      console.log(`Fetching review stats for product: ${productId}`);
      const reviewStats = await shopifyService.getReviewStats(productId);

      if (reviewStats) {
        // Update product with actual review data
        setProduct((prev) => ({
          ...prev,
          averageRating: reviewStats.averageRating || 0,
          totalReviews: reviewStats.totalReviews || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching reviews data:", err);
      // Don't set error for reviews, as they're optional
    }
  };

  useEffect(() => {
    if (productHandle) {
      fetchProductDetails();
    }
  }, [productHandle]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader size={48} style={styles.spinner} />
        <p style={styles.loadingText}>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <h2 style={styles.errorTitle}>Failed to Load Product</h2>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={onBack} style={styles.backButtonError}>
          <ArrowLeft size={20} />
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div>
      <button onClick={onBack} style={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Products
      </button>

      <div style={styles.productHeader}>
        <div>
          <h1 style={styles.productInsightTitle}>{product.title}</h1>
          <p style={styles.productId}>
            Product ID: {product.cleanId || product.id}
          </p>
          <p style={styles.productHandle}>Handle: @{product.handle}</p>
        </div>
        <div style={styles.productStatus}>
          <span
            style={{
              ...styles.statusBadge,
              ...(product.status === "Active"
                ? styles.activeBadge
                : styles.inactiveBadge),
            }}
          >
            {product.status}
          </span>
        </div>
      </div>

      {product.images && product.images.length > 0 && (
        <div style={styles.productImages}>
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} ${index + 1}`}
              style={styles.productImg}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/placeholder.png";
              }}
            />
          ))}
        </div>
      )}

      <ProductStats product={product} />
      <ProductDetails product={product} />
      {product.variants && product.variants.length > 0 && (
        <ProductVariants variants={product.variants} />
      )}

      <IngredientsSection
        productId={product.id}
        productHandle={product.handle}
      />
    </div>
  );
};

const styles = {
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "none",
    border: "none",
    color: "#6b7280",
    fontSize: "0.95rem",
    cursor: "pointer",
    marginBottom: "1.5rem",
    transition: "color 0.2s",
    "&:hover": {
      color: "#374151",
    },
  },
  productHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
  },
  productInsightTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.25rem",
  },
  productId: {
    color: "#6b7280",
    fontSize: "0.875rem",
    marginBottom: "0.25rem",
  },
  productHandle: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  productStatus: {
    display: "flex",
    alignItems: "center",
  },
  statusBadge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  activeBadge: {
    background: "#10b98120",
    color: "#10b981",
  },
  inactiveBadge: {
    background: "#ef444420",
    color: "#ef4444",
  },
  productImages: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    overflowX: "auto",
    padding: "0.5rem 0",
  },
  productImg: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    flexShrink: 0,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "1rem",
  },
  spinner: {
    animation: "spin 1s linear infinite",
    color: "#7c3aed",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "1.125rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "1rem",
    padding: "2rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #fecaca",
  },
  errorTitle: {
    color: "#dc2626",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  errorMessage: {
    color: "#6b7280",
    textAlign: "center",
    maxWidth: "400px",
  },
  backButtonError: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.5rem",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background 0.2s",
  },
};

// Add CSS animation for spinner if not already present
if (
  typeof document !== "undefined" &&
  !document.getElementById("product-insights-spinner-style")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "product-insights-spinner-style";
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ProductInsights;
