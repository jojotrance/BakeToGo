// resources/js/components/Cart.jsx
import React from 'react';

const Cart = () => {
    const cartItems = [
        { id: 1, name: 'Product 1', price: '₱1,799', image: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Product 2', price: '₱1,749', image: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Product 3', price: '₱1,249', image: 'https://via.placeholder.com/40' },
        { id: 4, name: 'Product 4', price: '₱1,499', image: 'https://via.placeholder.com/40' },
        { id: 5, name: 'Product 5', price: '₱1,099', image: 'https://via.placeholder.com/40' },
    ];

    return (
        <div>
            {cartItems.length === 0 ? (
                <p>No items in your cart</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <img src={item.image} alt={item.name} style={{ width: '40px', marginRight: '10px' }} />
                            {item.name} - {item.price}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
