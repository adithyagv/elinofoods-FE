import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import { DollarSign, ShoppingCart, Users, Eye } from "lucide-react";

const HomePage = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: "$124,563",
      change: 12.5,
      icon: DollarSign,
      color: "#10b981",
    },
    {
      label: "Total Orders",
      value: "1,234",
      change: 8.2,
      icon: ShoppingCart,
      color: "#3b82f6",
    },
    {
      label: "Total Customers",
      value: "892",
      change: -2.4,
      icon: Users,
      color: "#8b5cf6",
    },
    {
      label: "Page Views",
      value: "45.2K",
      change: 15.3,
      icon: Eye,
      color: "#f59e0b",
    },
  ];

  const activities = [
    {
      icon: ShoppingCart,
      text: "New order #1234 received",
      time: "2 minutes ago",
    },
    { icon: Users, text: "New customer registered", time: "15 minutes ago" },
    { icon: "Package", text: "Product inventory updated", time: "1 hour ago" },
  ];

  return (
    <div>
      <h1 style={styles.pageTitle}>Dashboard Overview</h1>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      <RecentActivity activities={activities} />
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "2rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
};

export default HomePage;
