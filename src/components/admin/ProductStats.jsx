import { TrendingUp } from "lucide-react";

const ProductStats = ({ product }) => {
  const stats = [
    {
      title: "Sales Performance",
      value: product.totalSales,
      label: "Total Sales",
      trend: { value: product.monthlyGrowth, label: "this month" },
    },
    {
      title: "Revenue",
      value: product.revenue,
      label: "Total Revenue",
    },
    {
      title: "Customer Feedback",
      value: `⭐ ${product.averageRating}`,
      label: `${product.totalReviews} Reviews`,
    },
    {
      title: "Inventory",
      value: product.currentInventory,
      label: "Units in Stock",
    },
  ];

  return (
    <div style={styles.insightsGrid}>
      {stats.map((stat, index) => (
        <div key={index} style={styles.insightCard}>
          <h3>{stat.title}</h3>
          <div style={styles.insightValue}>{stat.value}</div>
          <div style={styles.insightLabel}>{stat.label}</div>
          {stat.trend && (
            <div style={styles.insightTrend}>
              <TrendingUp size={16} color="#10b981" />
              <span style={{ color: "#10b981" }}>
                {stat.trend.value}% {stat.trend.label}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  insightCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  insightValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    margin: "0.5rem 0",
  },
  insightLabel: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  insightTrend: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    marginTop: "0.5rem",
    fontSize: "0.875rem",
  },
};

export default ProductStats;
