const ProductVariants = ({ variants }) => {
  return (
    <div style={styles.variantsSection}>
      <h2 style={styles.sectionTitle}>Variants</h2>
      <div style={styles.variantsTable}>
        <div style={styles.tableHeader}>
          <span>Variant</span>
          <span>Price</span>
          <span>Inventory</span>
        </div>
        {variants.map((variant) => (
          <div key={variant.id} style={styles.tableRow}>
            <span>{variant.title}</span>
            <span>{variant.price}</span>
            <span>{variant.inventory} units</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  variantsSection: {
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
  variantsTable: {
    width: "100%",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "0.75rem",
    background: "#f9fafb",
    borderRadius: "8px",
    fontWeight: "600",
    color: "#4b5563",
    fontSize: "0.875rem",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "0.75rem",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "0.95rem",
  },
};

export default ProductVariants;
