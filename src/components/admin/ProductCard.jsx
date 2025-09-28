import { Package, ChevronRight, AlertCircle, Check, X } from "lucide-react";

const ProductCard = ({ product, onSelect }) => {
  const isAvailable = product.availableForSale !== false;
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <div
      style={{
        ...styles.productCard,
        ...(isAvailable ? {} : styles.unavailableCard),
      }}
      onClick={onSelect}
    >
      {!isAvailable && (
        <div style={styles.unavailableBadge}>
          <AlertCircle size={14} />
          <span>Unavailable</span>
        </div>
      )}

      <div style={styles.productImage}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt || product.title}
            style={styles.image}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          style={
            product.image
              ? styles.imagePlaceholderHidden
              : styles.imagePlaceholder
          }
        >
          <Package size={48} color="#6b7280" />
        </div>
      </div>

      <div style={styles.productContent}>
        <h3 style={styles.productTitle}>{product.title}</h3>
        <p style={styles.productHandle}>@{product.handle}</p>

        {product.description && (
          <p style={styles.productDescription}>
            {product.description.length > 80
              ? `${product.description.substring(0, 80)}...`
              : product.description}
          </p>
        )}

        <div style={styles.productStats}>
          <span style={styles.price}>{product.price}</span>
          {hasVariants && (
            <span style={styles.variants}>
              {product.variants.length} variants
            </span>
          )}
        </div>

        <div style={styles.availabilityRow}>
          <div
            style={{
              ...styles.availabilityBadge,
              ...(isAvailable
                ? styles.availableBadge
                : styles.unavailableBadgeSmall),
            }}
          >
            {isAvailable ? <Check size={14} /> : <X size={14} />}
            <span>{isAvailable ? "Available" : "Out of Stock"}</span>
          </div>
        </div>

        <button style={styles.viewButton}>
          View Insights
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  productCard: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.3s",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  unavailableCard: {
    opacity: "0.9",
  },
  unavailableBadge: {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "0.25rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    zIndex: 1,
  },
  productImage: {
    width: "100%",
    height: "200px",
    background: "#f3f4f6",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9fafb",
  },
  imagePlaceholderHidden: {
    display: "none",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9fafb",
  },
  productContent: {
    padding: "1.25rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  productTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.25rem",
    lineHeight: "1.4",
  },
  productHandle: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "0.75rem",
  },
  productDescription: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1rem",
    lineHeight: "1.5",
  },
  productStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  price: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
  },
  variants: {
    fontSize: "0.875rem",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "0.25rem 0.75rem",
    borderRadius: "6px",
  },
  availabilityRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  availabilityBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.25rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  availableBadge: {
    background: "#f0fdf4",
    color: "#16a34a",
  },
  unavailableBadgeSmall: {
    background: "#fef2f2",
    color: "#dc2626",
  },
  viewButton: {
    width: "100%",
    padding: "0.625rem",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    cursor: "pointer",
    transition: "background 0.2s",
    fontSize: "0.95rem",
    fontWeight: "500",
    marginTop: "auto",
  },
};

export default ProductCard;
