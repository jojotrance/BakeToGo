$(document).ready(function () { 
    $.ajax({
        type: "GET",
        url: "/api/shop",
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.each(data, function (key, value) {
                // console.log(key);
                id = value.item_id;
                var item = "<div class='item'><div class='itemDetails'><div class='itemImage'><img src=" + value.image + " width='200px', height='200px'/></div><div class='itemText'><h5>" + value.name + "</h5><p>Category: " + value.category + "</p><p class='price-container'>Price: Php <span class='price'>" + value.price + "</span></p><p>" + value.description + "</p><p>Stock: " + value.stock + "</p></div><input type='number' class='qty' name='quantity' min='1' max=" + value.stock + "><p class='itemId'>" + value.id + "</p></div><button type='button' class='btn btn-primary add' >Add to cart</button></div>";
                $("#items").append(item);

            });

        },
        error: function () {
            console.log('AJAX load did not work');
            alert("error");
        }
    
    });
});