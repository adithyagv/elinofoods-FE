const ProductDetails = ({ product }) => {
  return (
    <div style={styles.detailsSection}>
      <h2 style={styles.sectionTitle}>Product Details</h2>
      <div style={styles.detailsGrid}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Handle:</span>
          <span>{product.handle}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Vendor:</span>
          <span>{product.vendor}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Type:</span>
          <span>{product.productType}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Created:</span>
          <span>{product.createdAt}</span>
        </div>
      </div>
      <div style={styles.description}>
        <span style={styles.detailLabel}>Description:</span>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

const styles = {
  detailsSection: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1.5rem",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    marginBottom: "1rem",
  },
  detailItem: {
    display: "flex",
    gap: "0.5rem",
  },
  detailLabel: {
    fontWeight: "600",
    color: "#4b5563",
  },
  description: {
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e5e7eb",
  },
};

export default ProductDetails;
