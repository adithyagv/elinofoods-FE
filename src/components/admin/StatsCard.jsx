import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div style={styles.statCard}>
      <div style={styles.statHeader}>
        <div style={{ ...styles.statIcon, backgroundColor: `${stat.color}20` }}>
          <Icon size={24} color={stat.color} />
        </div>
        <div style={styles.statChange}>
          {stat.change > 0 ? (
            <TrendingUp size={16} color="#10b981" />
          ) : (
            <TrendingDown size={16} color="#ef4444" />
          )}
          <span style={{ color: stat.change > 0 ? "#10b981" : "#ef4444" }}>
            {Math.abs(stat.change)}%
          </span>
        </div>
      </div>
      <div style={styles.statValue}>{stat.value}</div>
      <div style={styles.statLabel}>{stat.label}</div>
    </div>
  );
};

const styles = {
  statCard: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statChange: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem",
  },
  statValue: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.25rem",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
};

export default StatsCard;
