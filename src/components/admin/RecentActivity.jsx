import { Package } from "lucide-react";

const RecentActivity = ({ activities }) => {
  return (
    <div style={styles.recentActivity}>
      <h2 style={styles.sectionTitle}>Recent Activity</h2>
      <div style={styles.activityList}>
        {activities.map((activity, index) => {
          const Icon = activity.icon === "Package" ? Package : activity.icon;
          return (
            <div key={index} style={styles.activityItem}>
              <div style={styles.activityIcon}>
                <Icon size={16} />
              </div>
              <div style={styles.activityContent}>
                <p>{activity.text}</p>
                <span style={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  recentActivity: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1.5rem",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.75rem",
    background: "#f9fafb",
    borderRadius: "8px",
  },
  activityIcon: {
    width: "36px",
    height: "36px",
    background: "#7c3aed20",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7c3aed",
  },
  activityContent: {
    flex: 1,
  },
  activityTime: {
    fontSize: "0.875rem",
    color: "#9ca3af",
  },
};

export default RecentActivity;
