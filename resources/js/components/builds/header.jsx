import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '@css/header.css'; 

function Header({ user, hideComponents, hideSearchBar }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: '₱1,799', image: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Product 2', price: '₱1,749', image: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Product 3', price: '₱1,249', image: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Product 4', price: '₱1,499', image: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Product 5', price: '₱1,099', image: 'https://via.placeholder.com/40' },
  ]);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await axios.post('/api/logout');
      setTimeout(() => {
        window.location.href = '/home';
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
      return 'https://via.placeholder.com/40';
    }
    return `/storage/${user.profile_image}`;
  };

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    window.dispatchEvent(new CustomEvent('search-query', { detail: newQuery }));
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {user.role !== 'admin' && (
            <button className="logo-button" onClick={() => navigate('/customer/dashboard')}>
              <img src="../logos/baketogo.jpg" alt="Logo" className="logo" />
            </button>
          )}
        </div>
        {user.role === 'customer' && !hideSearchBar && (
          <div className="search-bar">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={query}
                onChange={handleSearchChange}
              />
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
              <button onClick={() => navigate('/customer/cart')}>
                <ShoppingCartIcon className="cart-icon" />
              </button>
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
                        <button className="view-cart-button" onClick={() => navigate('/customer/cart')}>View My Shopping Cart</button>
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
              {user.role === 'customer' && (
                <li>
                  <PersonRoundedIcon className="dropdown-icon" />
                  <button onClick={() => {
                    navigate('/customer/profile');
                    toggleDropdown();
                  }}>Manage Profile</button>
                </li>
              )}
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
  hideComponents: PropTypes.bool.isRequired,
  hideSearchBar: PropTypes.bool.isRequired,
};

export default Header;
