import { useState } from "react";
import { X, Upload, Image as ImageIcon, Save } from "lucide-react";

const IngredientModal = ({ ingredient, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: ingredient?.name || "",
    image: ingredient?.image || "",
  });
  const [imagePreview, setImagePreview] = useState(ingredient?.image || "");
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.image) {
      onSave(formData);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>{ingredient ? "Edit Ingredient" : "Add New Ingredient"}</h2>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.modalForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Ingredient Name
              <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter ingredient name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Ingredient Image
              <span style={styles.required}>*</span>
            </label>

            <div
              style={{
                ...styles.imageUploadArea,
                ...(dragOver ? styles.dragOver : {}),
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div style={styles.imagePreviewContainer}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={styles.imagePreview}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setFormData({ ...formData, image: "" });
                    }}
                    style={styles.removeImageButton}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <Upload size={48} color="#9ca3af" />
                  <p style={styles.uploadText}>
                    Drag and drop an image here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={styles.fileInput}
                    id="file-upload"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    style={styles.browseButton}
                  >
                    <ImageIcon size={16} />
                    Browse Files
                  </button>
                </div>
              )}
            </div>

            {!imagePreview && (
              <div style={styles.imageUrlOption}>
                <div style={styles.orDivider}>
                  <span>OR</span>
                </div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Enter image URL"
                  style={styles.input}
                />
              </div>
            )}
          </div>

          <div style={styles.modalActions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button
              type="submit"
              style={styles.saveButton}
              disabled={!formData.name || !formData.image}
            >
              <Save size={16} />
              {ingredient ? "Update Ingredient" : "Add Ingredient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    padding: "0.25rem",
  },
  modalForm: {
    padding: "1.5rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#374151",
    fontWeight: "500",
    fontSize: "0.95rem",
  },
  required: {
    color: "#ef4444",
    marginLeft: "0.25rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.95rem",
  },
  imageUploadArea: {
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    padding: "2rem",
    textAlign: "center",
    position: "relative",
    transition: "all 0.3s",
  },
  dragOver: {
    borderColor: "#7c3aed",
    background: "#7c3aed05",
  },
  uploadPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  uploadText: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  fileInput: {
    display: "none",
  },
  browseButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  imagePreviewContainer: {
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  removeImageButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  imageUrlOption: {
    marginTop: "1rem",
  },
  orDivider: {
    textAlign: "center",
    color: "#9ca3af",
    margin: "1rem 0",
    fontSize: "0.875rem",
  },
  modalActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    paddingTop: "1rem",
    borderTop: "1px solid #e5e7eb",
  },
  cancelButton: {
    padding: "0.625rem 1.5rem",
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.5rem",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
};

export default IngredientModal;
