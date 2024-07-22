import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/builds/header';
import Sidebar from './components/admin/admin-sidebar'; // Admin sidebar
import CustomerSidebar from './components/customer/customer-sidebar'; // Customer sidebar
import ProductMenu from './components/customer/product-menu'; // Customer product menu
import Cart from './components/customer/cart'; // Correct path for the Cart component
import axios from 'axios';
import '@css/app.css';

function App() {
  const [user, setUser] = useState(null);
  const [hideComponents, setHideComponents] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user-profile');
        setUser(response.data); // Assuming response.data contains user profile data
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const reactRoot = document.getElementById('hello-react');
    if (reactRoot) {
      const hide = reactRoot.getAttribute('data-hide-components') === 'true';
      setHideComponents(hide);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Add a loading indicator or handle the loading state
  }

  const role = user.role === 'admin' ? 'admin' : 'customer'; // Assuming user.role is properly set

  return (
    <Router>
      <div className="App">
        <HeaderWrapper user={{ ...user, role }} hideComponents={hideComponents} /> {/* Wrapper to manage location */}
        <div className="main-wrapper">
          {!hideComponents && role === 'admin' && <Sidebar />} {/* Render Admin Sidebar based on user role */}
          {!hideComponents && role === 'customer' && <ConditionalCustomerSidebar />} {/* Render Conditional Customer Sidebar */}
          <div className="content">
            <Routes>
              {role === 'customer' && (
                <>
                  <Route path="/customer/cart" element={<Cart />} /> {/* Render Cart for /customer/cart route */}
                  <Route path="/customer/dashboard" element={<ProductMenu />} /> {/* Render ProductMenu for /customer/dashboard route */}
                  <Route path="/customer/profile" element={<Profile />} /> {/* Render Profile for /customer/profile route */}
                </>
              )}
              {/* Add other routes here */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

function HeaderWrapper({ user, hideComponents }) {
  const location = useLocation();
  const hideSearchBar = location.pathname === '/customer/profile';

  return <Header user={user} hideComponents={hideComponents} hideSearchBar={hideSearchBar} />;
}

function ConditionalCustomerSidebar() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/customer/profile';
  return hideSidebar ? null : <CustomerSidebar />;
}

function Profile() {
  return (
    <div>
      <h2>Profile Page</h2>
      <p>This is the profile page.</p>
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hello-react');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  } else {
    console.error('Element with id "hello-react" not found.');
  }
});

export default App;
