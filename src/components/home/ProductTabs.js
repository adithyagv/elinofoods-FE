import "./ProductTabs.css";
import React, { useState, useEffect } from "react";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("bars"); // default to 'bars'
  const [products, setProducts] = useState({
    bars: [],
    shakes: [],
  });

  useEffect(() => {
    const fetchedProducts = {
      bars: [
        { id: 1, name: "Tosi - Crunchy Meal Bar", image: "/assets/logo.png" },
      ],
      shakes: [
        { id: 2, name: "Mango Chilli Jerky", image: "/assets/logo.png" },
      ],
    };
    setProducts(fetchedProducts);
  }, []);

  return (
    <div className="product-section">
      <h2>Our Products</h2>

      <div className="tabs">
        <button
          className={activeTab === "bars" ? "active" : ""}
          onClick={() => setActiveTab("bars")}
        >
          Bar Blast
        </button>
        <button
          className={activeTab === "shakes" ? "active" : ""}
          onClick={() => setActiveTab("shakes")}
        >
          Fruit Jerky
        </button>
      </div>

      <div className="products fade-in">
        {products[activeTab]?.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <button>View Product</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;
