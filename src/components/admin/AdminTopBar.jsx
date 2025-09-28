import { Search, Bell, User } from "lucide-react";

const AdminTopBar = () => {
  return (
    <div style={styles.topBar}>
      <div style={styles.searchContainer}>
        <Search size={20} style={styles.searchIcon} />
        <input type="text" placeholder="Search..." style={styles.searchInput} />
      </div>
      <div style={styles.topBarActions}>
        <button style={styles.iconButton}>
          <Bell size={20} />
          <span style={styles.notificationBadge}>3</span>
        </button>
        <button style={styles.profileButton}>
          <User size={20} />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  topBar: {
    height: "70px",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
  },
  searchContainer: {
    position: "relative",
    width: "400px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    padding: "0.625rem 1rem 0.625rem 2.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95rem",
  },
  topBarActions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  iconButton: {
    position: "relative",
    padding: "0.5rem",
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
  },
  notificationBadge: {
    position: "absolute",
    top: "4px",
    right: "4px",
    background: "#ef4444",
    color: "white",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    fontSize: "0.7rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "8px",
    color: "#374151",
    cursor: "pointer",
  },
};

export default AdminTopBar;
