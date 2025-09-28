import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Loader, AlertCircle, RefreshCw } from "lucide-react";
import { fetchAdminProducts } from "../../services/shopifyService";
const ProductsPage = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products from backend using shopifyService
  const fetchProducts = async () => {
    try {
      setError(null);

      // Use the shopifyService function
      const response = await fetchAdminProducts();

      if (response.success && response.products) {
        setProducts(response.products);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader size={48} style={styles.spinner} />
        <p style={styles.loadingText}>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <h2 style={styles.errorTitle}>Failed to Load Products</h2>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={handleRefresh} style={styles.retryButton}>
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2 style={styles.emptyTitle}>No Products Found</h2>
        <p style={styles.emptyMessage}>
          There are no products available in your store.
        </p>
        <button onClick={handleRefresh} style={styles.refreshButton}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Products Management</h1>
          <p style={styles.pageSubtitle}>
            Select a product to view insights and manage ingredients
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={styles.refreshButton}
          disabled={refreshing}
        >
          <RefreshCw size={16} style={refreshing ? styles.spinningIcon : {}} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total Products:</span>
          <span style={styles.statValue}>{products.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Available:</span>
          <span style={styles.statValue}>
            {products.filter((p) => p.availableForSale).length}
          </span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Out of Stock:</span>
          <span style={styles.statValue}>
            {products.filter((p) => !p.availableForSale).length}
          </span>
        </div>
      </div>

      <div style={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={() => onSelectProduct(product)}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "left",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  pageSubtitle: {
    color: "#6b7280",
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.2s",
  },
  statsBar: {
    display: "flex",
    gap: "2rem",
    padding: "1rem",
    background: "white",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    marginBottom: "2rem",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  statValue: {
    fontWeight: "600",
    color: "#111827",
    fontSize: "1rem",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
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
  spinningIcon: {
    animation: "spin 1s linear infinite",
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
  retryButton: {
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
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "1rem",
    padding: "2rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyTitle: {
    color: "#374151",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  emptyMessage: {
    color: "#6b7280",
    textAlign: "center",
  },
};

// Add CSS animation for spinner
if (
  typeof document !== "undefined" &&
  !document.head.querySelector("style[data-admin-animations]")
) {
  const styleSheet = document.createElement("style");
  styleSheet.setAttribute("data-admin-animations", "true");
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ProductsPage;
