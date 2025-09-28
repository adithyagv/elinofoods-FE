import { Home, Package, Menu, X, LogOut } from "lucide-react";

const AdminSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  setSelectedProduct,
}) => {
  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "products", label: "Products", icon: Package },
  ];

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    setSelectedProduct(null);
  };

  return (
    <div
      style={{
        ...styles.sidebar,
        ...(sidebarOpen ? {} : styles.sidebarClosed),
      }}
    >
      <div style={styles.sidebarHeader}>
        {/* <div style={styles.logo}>
          <Package size={24} />
          {sidebarOpen && <span style={styles.logoText}>Admin Panel</span>}
        </div> */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.menuButton}
        >
          {<Package size={24} />}
        </button>
        {sidebarOpen && <span style={styles.logoText}>Elino Foods-Admin</span>}
      </div>

      <nav style={styles.sidebarNav}>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handlePageChange(item.id)}
              style={{
                ...styles.sidebarItem,
                ...(activePage === item.id ? styles.sidebarItemActive : {}),
              }}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={styles.sidebarFooter}>
        <button onClick={onLogout} style={styles.logoutButton}>
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    background: "white",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s ease",
  },
  sidebarClosed: {
    width: "80px",
  },
  sidebarHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    color: "#7c3aed",
    fontWeight: "bold",
    fontSize: "1.25rem",
  },
  logoText: {
    color: "#111827",
  },
  menuButton: {
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    padding: "0.25rem",
  },
  sidebarNav: {
    flex: 1,
    padding: "1rem",
  },
  sidebarItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    marginBottom: "0.5rem",
    background: "none",
    border: "none",
    borderRadius: "8px",
    color: "#4b5563",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "0.95rem",
  },
  sidebarItemActive: {
    background: "#7c3aed",
    color: "white",
  },
  sidebarFooter: {
    padding: "1rem",
    borderTop: "1px solid #e5e7eb",
  },
  logoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    background: "none",
    border: "none",
    borderRadius: "8px",
    color: "#ef4444",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "0.95rem",
  },
};

export default AdminSidebar;
