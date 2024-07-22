document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
  });
  
  function fetchProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.data)) {
                displayProducts(data.data);
            } else {
                console.error('Data is not an array');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            displayProducts([{
                id: 1,
                name: 'Placeholder Product',
                description: 'This is a placeholder product description.',
                price: 0,
                image: 'https://via.placeholder.com/150',
            }]);
        });
  }
  
  function displayProducts(products) {
    const menu = document.getElementById('product-menu');
    menu.innerHTML = ''; // Clear existing products
  
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" />
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-description">${product.description}</p>
                <div class="product-pricing">
                    <span class="product-price">$${product.price}</span>
                </div>
                <button class="add-to-cart-button">Add to Cart</button>
            </div>
        `;
        card.querySelector('.add-to-cart-button').addEventListener('click', () => addToCart(product));
        menu.appendChild(card);
    });
  }
  
  function addToCart(product) {
    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: product.id }),
    })
    .then(response => {
        if (response.ok) {
            alert('Product added to cart successfully!');
        } else {
            throw new Error('Failed to add product to cart.');
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart.');
    });
  }