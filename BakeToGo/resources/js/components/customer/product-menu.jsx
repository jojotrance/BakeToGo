import React, { useEffect, useState } from 'react';
import '@css/product-menu.css'; // Use the alias for the CSS import
import axios from 'axios';

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products, displaying placeholder data.');
        // Set some placeholder data
        setProducts([
          {
            id: 1,
            name: 'Shoes',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: 10,
            originalPrice: 45,
            image: 'https://via.placeholder.com/150',
            offer: 'Offer expires in 3 days',
          },
          {
            id: 2,
            name: 'Earphones',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: 30,
            originalPrice: 40,
            image: 'https://via.placeholder.com/150',
            offer: 'Offer expires in 3 hours',
          },
          {
            id: 3,
            name: 'Headphones',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: 50,
            originalPrice: 60,
            image: 'https://via.placeholder.com/150',
            offer: 'Offer expires in 1 day',
          },
          {
            id: 4,
            name: 'Headphones',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: 50,
            originalPrice: 60,
            image: 'https://via.placeholder.com/150',
            offer: 'Offer expires in 1 day',
          },
          {
            id: 5,
            name: 'Headphones',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: 50,
            originalPrice: 60,
            image: 'https://via.placeholder.com/150',
            offer: 'Offer expires in 1 day',
          },
          // Add more unique placeholder products as needed
        ]);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    console.warn(error); // Display the error in the console, but continue to render the placeholder data
  }

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
                <span className="product-original-price">${product.originalPrice}</span>
                <span className="product-price">${product.price}</span>
              </div>
              <div className="product-offer">{product.offer}</div>
              <button className="add-to-cart-button">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMenu;
