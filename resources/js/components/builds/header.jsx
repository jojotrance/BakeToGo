import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '@css/header.css'; // Use the alias for the CSS import

function Header({ user, hideComponents }) {
  if (hideComponents) return null; // Don't render anything if hideComponents is true

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1werererwrr', price: '₱1,799', image: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Product 2', price: '₱1,749', image: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Product 3', price: '₱1,249', image: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Product 4', price: '₱1,499', image: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Product 5', price: '₱1,099', image: 'https://via.placeholder.com/40' },
  ]);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Define the missing variable

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await axios.post('/api/logout');
      setTimeout(() => {
        window.location.href = '/home'; // Redirect after logout
      }, 100);
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const getWelcomeMessage = () => {
    let roleMessage = '';
    if (user && user.role === 'admin') {
      roleMessage = 'Admin';
    } else if (user && user.role === 'customer') {
      roleMessage = 'Customer';
    }
    return `Welcome ${roleMessage}, ${user ? user.name : ''}`;
  };

  const handleImageError = () => {
    setImageError(true);
    console.error('Failed to load profile image');
  };

  const getImageSrc = () => {
    if (!user || !user.profile_image) {
      return 'https://via.placeholder.com/40'; // Placeholder image URL
    }
    return `/storage/${user.profile_image}`; // Correct path to storage directory
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/customer/dashboard">
            <img src="../logos/baketogo.jpg" alt="Logo" className="logo" />
          </Link>
        </div>
        {user.role === 'customer' && (
          <div className="search-bar">
            <div className="search-input-container">
              <input type="text" placeholder="Search..." className="search-input" />
              <SearchRoundedIcon className="search-icon" />
            </div>
          </div>
        )}
        <div className="header-right">
          {user.role === 'customer' && (
            <div
              className="cart-icon-container"
              onMouseEnter={() => setCartHovered(true)}
              onMouseLeave={() => setCartHovered(false)}
            >
              <Link to="/customer/cart">
                <ShoppingCartIcon className="cart-icon" />
              </Link>
              {cartHovered && (
                <div className="cart-popup">
                  <div className="cart-popup-content">
                    <div className="cart-popup-header">Recently Added Products</div>
                    {cartItems.length === 0 ? (
                      <>
                        <img src="/path/to/no-products-icon.png" alt="No Products" className="no-products-icon" />
                        <p>No Products Yet</p>
                      </>
                    ) : (
                      <>
                        <ul>
                          {cartItems.slice(0, 5).map((product) => (
                            <li key={product.id} className="cart-item">
                              <img src={product.image} alt={product.name} className="cart-item-image" />
                              <div className="cart-item-details">
                                <span className="cart-item-name">{product.name}</span>
                                <span className="cart-item-price">{product.price}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <Link to="/customer/cart" className="view-cart-button">View My Shopping Cart</Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div
            className="profile-section"
            onClick={toggleDropdown}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={dropdownVisible}
            onKeyPress={(e) => e.key === 'Enter' && toggleDropdown()}
          >
            <img
              src={getImageSrc()}
              alt="Profile"
              className="profile-pic"
              onError={handleImageError}
            />
            <span className="welcome-message">{getWelcomeMessage()}</span>
            <ul className={`profile-dropdown ${dropdownVisible ? 'visible' : ''}`}>
              <li>
                <PersonRoundedIcon className="dropdown-icon" />
                <Link to="/manage-profile">Manage Profile</Link>
              </li>
              <li>
                <ExitToAppRoundedIcon className="dropdown-icon" />
                <button onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    profile_image: PropTypes.string, // Assuming profile_image is optional
  }).isRequired,
  hideComponents: PropTypes.bool.isRequired, // Add hideComponents prop type
};

export default Header;
