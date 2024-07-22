// resources/js/components/ProductMenu.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        if (Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products, displaying placeholder data.');
        setProducts([
          {
            id: 1,
            name: 'Placeholder Product',
            description: 'This is a placeholder product description.',
            price: 0,
            image: 'https://via.placeholder.com/150',
          },
        ]);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      await axios.post('/api/cart', { product_id: product.id });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div className="product-menu">
      <h3>Products</h3>
      <div className="product-cards">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <p className="product-description">{product.description}</p>
              <div className="product-pricing">
                <span className="product-price">${product.price}</span>
              </div>
              <button className="add-to-cart-button" onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMenu;