import './ProductTabs.css';
import React, { useState, useEffect } from 'react';

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('bars'); // default to 'bars'
  const [products, setProducts] = useState({
    bars: [],
    shakes: [],
  });

  useEffect(() => {
    const fetchedProducts = {
      bars: [
        { id: 1, name: 'Choco Energy Bar', image: '/assets/logo.png' },
        { id: 2, name: 'Peanut Crunch', image: '/assets/logo.png' }
      ],
      shakes: [
        { id: 3, name: 'Berry Blast', image: '/assets/logo.png' },
        { id: 4, name: 'Banana Boost', image: '/assets/logo.png' }
      ]
    };
    setProducts(fetchedProducts);
  }, []);

  return (
    <div className="product-section">
      <h2>Our Products</h2>

      <div className="tabs">
        <button
          className={activeTab === 'bars' ? 'active' : ''}
          onClick={() => setActiveTab('bars')}
        >
          Bar Blast
        </button>
        <button
          className={activeTab === 'shakes' ? 'active' : ''}
          onClick={() => setActiveTab('shakes')}
        >
          Shakes
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
