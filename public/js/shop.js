$(document).ready(function () { 
    $.ajax({
        type: "GET",
        url: "/api/shop",
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.each(data, function (key, value) {
                id = value.item_id;
                var item = "<div class='item'><div class='itemDetails'><div class='itemImage'><img src=" + value.image + " width='200px', height='200px'/></div><div class='itemText'><h5>" + value.name + "</h5><p>Category: " + value.category + "</p><p class='price-container'>Price: Php <span class='price'>" + value.price + "</span></p><p>" + value.description + "</p><p>Stock: " + value.stock + "</p></div><input type='number' class='quantity' name='quantity' min='1' max=" + value.stock + "><p class='itemId'>" + value.id + "</p></div><button type='button' class='btn btn-primary add' >Add to cart</button></div>";
                $("#items").append(item);

            });
        },
        error: function () {
            console.log('AJAX load did not work');
            alert("error");
        }
    
    });

    $("#items").on('click', '.add', function () {
		var item = $(this).closest('.item');
        var productId = item.find('.itemId').text();
        var quantity = item.find('.qty').val();

		$.ajax({
            type: "POST",
            url: "/api/addtoCart",
            data: JSON.stringify({
                product_id: productId,
                quantity: quantity
            }),
            contentType: "application/json",
            success: function (response) {
				(response.message, 'success');
			},
			error: function (xhr, status, error) {
                console.error("Error adding item to cart:", status, error);
                showFlashMessage('Error adding item to cart.', 'danger');
            }
        });
    });

    $('.openCloseCart').click(function () {
		$('#shoppingCart').show();
	});
    $('#close').click(function () {
		$('#shoppingCart').hide();
	});

    $('#shoppingCart').on('click', '.removeItem', function () {
		$(this).parent().remove();
		itemCount--;
		$('#itemCount').text(itemCount);
		var price = parseInt($(this).siblings().find('.price').text());
		priceTotal -= price;
		$('#cartTotal').text("Total: php" + priceTotal);

		if (itemCount === 0) {
			$('#itemCount').css('display', 'none');
            $('#shoppingCart').hide();
		}
	});

    $('#emptyCart').click(function () {
		itemCount = 0;
		priceTotal = 0;

		$('#itemCount').css('display', 'none');
		$('#cartItems').text('');
		$('#cartTotal').text("Total: php" + priceTotal);
	});

	$('#checkout').click(function(e) {
		e.preventDefault();

		const csrfToken = $('meta[name="csrf-token"]').attr('content');

		let items = [];
		$(".itemDetails").each(function() {
			let itemid = parseInt($(this).find(".itemId").html()); // Adjust as per your HTML structure
			let qty = parseInt($(this).find(".qty").val()); // Adjust as per your HTML structure
			items.push({
				"item_id": itemid,
				"quantity": qty
			});
		});

		let courierId = $('#courier').val();
		let paymentMethod = $('#paymentMethod').val();

		$.ajax({
			type: "POST",
			url: "/api/checkout",
			headers: {
				'X-CSRF-TOKEN': csrfToken // Set CSRF token in the headers
			},
			data: JSON.stringify({
				items: items,
				courier_id: courierId,
				payment_method: paymentMethod
			}),
			contentType: "application/json",
			success: function(response) {
				if (response.code === 200) {
					// Redirect to dashboard with success message
					window.location.href = '/customer/dashboard';
					alert('Successfully ordered!'); // Optionally show an alert
				} else {
					alert(response.error); 
				}
			},
			error: function(xhr, status, error) {
				console.error('Error status:', status);
				console.error('Error details:', error);
				alert('Error processing checkout. Status: ' + status + '. Error: ' + error);
			}
		});	
	});		
});