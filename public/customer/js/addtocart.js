$(document).ready(function () {
    var path = window.location.pathname;
    var productId = path.split('/').pop();

    // Assuming there's a button with the ID 'add-to-cart-btn'
    $('#add-to-cart-btn').click(function() {
        addToCart(productId, 1); // Assuming a quantity of 1 for simplicity
    });
});

function addToCart(productId, quantity) {
    $.ajax({
        url: '/api/cart', // Your API endpoint for adding items to the cart
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ productId: productId, quantity: quantity }),
        success: function(response) {
            alert('Product added to cart successfully!');
            // Optionally, update the cart UI here
        },
        error: function(xhr, status, error) {
            alert('Error adding product to cart. Please try again.');
            // Handle error
        }
    });
}