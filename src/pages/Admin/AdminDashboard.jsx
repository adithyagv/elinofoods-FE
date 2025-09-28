import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopBar from "../../components/admin/AdminTopBar";
import HomePage from "../../components/admin/HomePage";
import ProductsPage from "../../components/admin/ProductsPage";
import ProductInsights from "../../components/admin/ProductInsights";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div style={styles.container}>
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        setSelectedProduct={setSelectedProduct}
      />

      <div style={styles.mainContent}>
        <AdminTopBar />

        <div style={styles.pageContent}>
          {activePage === "home" && <HomePage />}
          {activePage === "products" && !selectedProduct && (
            <ProductsPage onSelectProduct={setSelectedProduct} />
          )}
          {activePage === "products" && selectedProduct && (
            <ProductInsights
              productId={selectedProduct.id}
              productHandle={selectedProduct.handle} // Pass the handle
              onBack={() => setSelectedProduct(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f9fafb",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  pageContent: {
    flex: 1,
    padding: "2rem",
    overflow: "auto",
  },
};

export default AdminDashboard;
