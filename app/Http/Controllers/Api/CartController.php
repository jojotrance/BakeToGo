<?php

// app/Http/Controllers/Customer/CartController.php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        // Logic to return the cart's contents (API)
        return response()->json([
            'cart' => auth()->user()->cart
        ]);
    }
    public function show()
    {
        // Example data - Replace this with your actual cart data retrieval logic
        $cartItems = [
            ['id' => 1, 'name' => 'Product 1', 'price' => '₱1,799', 'image' => 'https://via.placeholder.com/40'],
            ['id' => 2, 'name' => 'Product 2', 'price' => '₱1,749', 'image' => 'https://via.placeholder.com/40'],
            ['id' => 3, 'name' => 'Product 3', 'price' => '₱1,249', 'image' => 'https://via.placeholder.com/40'],
            ['id' => 4, 'name' => 'Product 4', 'price' => '₱1,499', 'image' => 'https://via.placeholder.com/40'],
            ['id' => 5, 'name' => 'Product 5', 'price' => '₱1,099', 'image' => 'https://via.placeholder.com/40'],
        ];

        return view('customer.pages.cart', compact('cartItems'));
    }

    public function store(Request $request)
    {
        // Logic to add an item to the cart (API)
        $item = $request->input('item');
        // Add item to cart logic here...
        return response()->json([
            'message' => 'Item added to cart',
        ]);
    }

    public function destroy($itemId)
    {
        // Logic to remove an item from the cart (API)
        // Remove item from cart logic here...
        return response()->json([
            'message' => 'Item removed from cart',
        ]);
    }

   


 
}
