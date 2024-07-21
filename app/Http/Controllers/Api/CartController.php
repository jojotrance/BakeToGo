<?php

// app/Http/Controllers/Customer/CartController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show()
    {
        $user = auth()->user(); // Assuming you're using Laravel's authentication

        $cartItems = Cart::where('user_id', $user->id)->get();

        return response()->json(['data' => $cartItems]);
    }

    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = auth()->user(); // Assuming you're using Laravel's authentication

        // Check if the product is already in the cart
        $cartItem = Cart::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            // If the item is already in the cart, update the quantity
            $cartItem->quantity += $validated['quantity'];
            $cartItem->save();
        } else {
            // If not, add a new item to the cart
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity']
            ]);
        }

        return response()->json(['message' => 'Product added to cart successfully']);
    }
}
