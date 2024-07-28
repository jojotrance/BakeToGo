import $ from 'jquery';
import algoliasearch from 'algoliasearch/lite';

// Define necessary functions and initialize Algolia search client
$(document).ready(function () {
    const searchClient = algoliasearch('SKGEMY1IVJ', '90477025cfd3896f776e79b8d0625bca');
    const index = searchClient.initIndex('products');

    //YUNG PRODUCT NASA HEADER.JS HEHE Yun yung gumagana hehe sorry

    // Function to add event listeners to items
    function addEventListenersToItems() {
        $('.add').off('click').on('click', function () {
            const item = $(this).closest('.menu-item');
            const productId = item.find('.itemId').text();
            const quantity = 1; // Default quantity to 1 for simplicity

            // Check the stock availability from the product data table
            checkStockAvailability(productId, function(isAvailable) {
                if (!isAvailable) {
                    alert('This item is out of stock.');
                    return; // Exit the function if the item is out of stock
                }

                console.log('Add to cart clicked, product ID:', productId, 'quantity:', quantity); // Debugging

                const payload = {
                    product_id: productId,
                    quantity: quantity
                };

                console.log('Payload:', payload); // Log the payload

                $.ajax({
                    type: "POST",
                    url: "/api/addtoCart",
                    data: JSON.stringify(payload),
                    contentType: "application/json",
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (response) {
                        console.log('Add to cart success', response); // Debugging
                        alert('Item added to cart successfully!');
                    },
                    error: function (xhr, status, error) {
                        console.error("Error adding item to cart:", status, error);
                        console.error("Response Text:", xhr.responseText); // Log the response text
                        alert('Error adding item to cart.');
                    }
                });
            });
        });
    }

    // Function to check stock availability
    function checkStockAvailability(productId, callback) {
        $.ajax({
            type: "GET",
            url: `/api/admin/products/${productId}`,
            dataType: 'json',
            success: function (data) {
                const stock = data.total_stock; // Ensure total_stock is used
                console.log('Stock for product ID', productId, ':', stock); // Debugging
                callback(stock > 0); // Check if stock is greater than 0
            },
            error: function () {
                console.error('Error checking stock availability.');
                callback(false); // Assume out of stock if there's an error
            }
        });
    }

    // Initial load of products
    loadProducts();

    // Listen for search-query event
    window.addEventListener('search-query', function (e) {
        const query = e.detail;
        if (query) {
            performSearch(query);
        } else {
            loadProducts(); // Load initial products if search query is empty
        }
    });

    function performSearch(query) {
        // Search with Algolia
        index.search(query).then(({ hits }) => {
            $('#items').empty(); // Clear previous items
            hits.forEach(hit => {
                var imageUrl = hit.image ? `/storage/product_images/${hit.image}` : '/storage/product_images/default-placeholder.png';
                var stock = hit.total_stock !== undefined ? hit.total_stock : 'Unavailable'; // Ensure total_stock is used

                var item = `
                    <div class='menu-item'>
                        <div class='item-image'>
                            <img src='${imageUrl}' alt='${hit.name}' />
                        </div>
                        <div class='item-details'>
                            <h5 class='item-name'>${hit.name}</h5>
                            <p>Category: ${hit.category}</p>
                            <p class='item-price'>Price: Php <span class='price'>${hit.price}</span></p>
                            <p class='item-description'>${hit.description}</p>
                            <p>Stock: ${stock}</p>
                            <p class='itemId' hidden>${hit.id}</p>
                        </div>
                        <button type='button' class='btn btn-buy-now add'>Add to cart</button>
                    </div>`;
                $("#items").append(item);
            });

            // Add event listeners for the new items
            addEventListenersToItems();
        }).catch(err => {
            console.error(err);
        });
    }
});
