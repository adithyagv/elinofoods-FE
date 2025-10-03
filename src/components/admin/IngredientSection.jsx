// components/IngredientsSection.jsx
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Package, AlertCircle } from "lucide-react";
import IngredientModal from "./IngredientModal";
import shopifyService from "../../services/shopifyService";

const 

IngredientsSection = ({ productId: shopifyProductId, productHandle }) => {
  // Use the helper from shopifyService
  const productId =
    shopifyService.cleanProductId(shopifyProductId) || productHandle || null;

  const [ingredients, setIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIngredients = async () => {
    if (!productId) {
      console.warn("No product ID available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use shopifyService to fetch ingredients
      const filteredIngredients = await shopifyService.getProductIngredients(
        productId
      );

      console.log(
        `Product ID: ${productId}, Found ${filteredIngredients.length} ingredients`
      );

      setIngredients(filteredIngredients);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Raw Shopify Product ID:", shopifyProductId);
    console.log("Cleaned Product ID:", productId);
    console.log("Product Handle:", productHandle);

    if (productId) {
      fetchIngredients();
    }
  }, [productId]);

  const handleAdd = () => {
    setEditingIngredient(null);
    setShowModal(true);
  };

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
    setShowModal(true);
  };

  const handleDelete = async (ingredientId) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) {
      return;
    }

    setLoading(true);
    try {
      await shopifyService.deleteIngredient(ingredientId);

      setIngredients((prev) =>
        prev.filter((ing) => ing.ingredient_id !== ingredientId)
      );
      console.log(`Successfully deleted ingredient: ${ingredientId}`);
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      alert(`Failed to delete ingredient: ${error.message}`);
      await fetchIngredients();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    if (!productId) {
      alert("Product ID is required to save ingredients");
      return;
    }

    try {
      if (editingIngredient) {
        // Update existing ingredient
        const updateData = {
          ingredient_name: formData.name,
          ingredient_image: formData.image,
          product_id: editingIngredient.product_id, // Keep original product_id
        };

        await shopifyService.updateIngredient(
          editingIngredient.ingredient_id,
          updateData
        );

        await fetchIngredients();
        setShowModal(false);
      } else {
        // Add new ingredient
        const newIngredient = {
          ingredient_id: shopifyService.generateIngredientId(productId),
          ingredient_name: formData.name,
          ingredient_image: formData.image || "",
          product_id: String(productId),
        };

        console.log("Creating new ingredient:", newIngredient);

        await shopifyService.addIngredient(newIngredient);

        console.log("Ingredient added successfully");
        await fetchIngredients();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving ingredient:", error);
      alert(`Failed to save ingredient: ${error.message}`);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingIngredient(null);
  };

  const stats = {
    totalCount: ingredients.length,
    withImages: ingredients.filter((ing) => ing.ingredient_image).length,
  };

  // Show message if no product ID
  if (!productId) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          <AlertCircle size={20} />
          <span>Product ID is required to manage ingredients</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.container}>
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <Package size={20} color="#7c3aed" />
            <div>
              <p style={styles.statLabel}>Total Ingredients</p>
              <p style={styles.statValue}>{stats.totalCount}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <Package size={20} color="#10b981" />
            <div>
              <p style={styles.statLabel}>With Images</p>
              <p style={styles.statValue}>{stats.withImages}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <Package size={20} color="#3b82f6" />
            <div>
              <p style={styles.statLabel}>Product ID</p>
              <p
                style={{
                  ...styles.statValue,
                  fontSize: "1rem",
                  wordBreak: "break-all",
                }}
              >
                {productId}
              </p>
            </div>
          </div>
        </div>

        <div style={styles.ingredientsSection}>
          <div style={styles.ingredientsHeader}>
            <h2 style={styles.sectionTitle}>Ingredients</h2>
            <button onClick={handleAdd} style={styles.addButton}>
              <Plus size={16} />
              Add Ingredient
            </button>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={fetchIngredients} style={styles.retryButton}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div style={styles.loadingMessage}>
              <div style={styles.spinner}></div>
              Loading ingredients...
            </div>
          ) : (
            <div style={styles.ingredientsGrid}>
              {ingredients.length === 0 ? (
                <div style={styles.emptyMessage}>
                  <Package size={48} color="#9ca3af" />
                  <p>No ingredients found for this product</p>
                  <p style={styles.emptySubtext}>Product ID: {productId}</p>
                  <p style={styles.emptySubtext}>
                    Add your first ingredient to get started
                  </p>
                </div>
              ) : (
                ingredients.map((ingredient) => (
                  <div
                    key={ingredient._id || ingredient.ingredient_id}
                    style={styles.ingredientCard}
                  >
                    <div style={styles.ingredientImage}>
                      {ingredient.ingredient_image ? (
                        <img
                          src={ingredient.ingredient_image}
                          alt={ingredient.ingredient_name}
                          style={styles.image}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div style={styles.imagePlaceholder}>
                          <Package size={32} color="#9ca3af" />
                        </div>
                      )}
                    </div>
                    <div style={styles.ingredientInfo}>
                      <h4 style={styles.ingredientName}>
                        {ingredient.ingredient_name}
                      </h4>
                      <p style={styles.ingredientId}>
                        ID: {ingredient.ingredient_id}
                      </p>
                    </div>
                    <div style={styles.ingredientActions}>
                      <button
                        onClick={() => handleEdit(ingredient)}
                        style={styles.actionButton}
                        title="Edit"
                        disabled={loading}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.ingredient_id)}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        title="Delete"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <IngredientModal
          ingredient={
            editingIngredient
              ? {
                  name: editingIngredient.ingredient_name,
                  image: editingIngredient.ingredient_image,
                  product_id: editingIngredient.product_id,
                }
              : null
          }
          productId={productId}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </>
  );
};

// Styles remain the same...
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  statCard: {
    background: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: 0,
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  ingredientsSection: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  ingredientsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.2s",
  },
  ingredientsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
  },
  ingredientCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "all 0.2s",
  },
  ingredientImage: {
    width: "100%",
    height: "180px",
    background: "#f3f4f6",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  ingredientInfo: {
    padding: "1rem",
  },
  ingredientName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 0.25rem 0",
  },
  ingredientId: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    margin: "0.25rem 0",
  },
  ingredientActions: {
    display: "flex",
    gap: "0.5rem",
    padding: "0 1rem 1rem",
  },
  actionButton: {
    padding: "0.5rem",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  deleteButton: {
    color: "#ef4444",
  },
  errorMessage: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  retryButton: {
    marginLeft: "auto",
    background: "#991b1b",
    color: "white",
    border: "none",
    padding: "0.25rem 0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  loadingMessage: {
    textAlign: "center",
    color: "#6b7280",
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  emptyMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#9ca3af",
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  emptySubtext: {
    fontSize: "0.875rem",
    color: "#d1d5db",
  },
};

// Add CSS animation for spinner
if (
  typeof document !== "undefined" &&
  !document.getElementById("ingredients-spinner-style")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "ingredients-spinner-style";
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default IngredientsSection;
