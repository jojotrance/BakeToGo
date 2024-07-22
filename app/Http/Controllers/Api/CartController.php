<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function cart()
    {
        return view('cart');
    }
    public function addToCart($id)
    {
        $product = Product::findOrFail($id);

        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity']++;
        } else {
            $cart[$id] = [
                "product_name" => $product->product_name,
                "photo" => $product->photo,
                "price" => $product->price,
                "quantity" => 1
            ];
        }

        session()->put('cart', $cart);
        return redirect()->back()->with('success', 'Product add to cart successfully!');
    }

    public function update(Request $request)
    {
        if ($request->id && $request->quantity) {
            $cart = session()->get('cart');
            $cart[$request->id]["quantity"] = $request->quantity;
            session()->put('cart', $cart);
            session()->flash('success', 'Cart successfully updated!');
        }
    }

    public function remove(Request $request)
    {
        if ($request->id) {
            $cart = session()->get('cart');
            if (isset($cart[$request->id])) {
                unset($cart[$request->id]);
                session()->put('cart', $cart);
            }
            session()->flash('success', 'Product successfully removed!');
        }
    }

    // public function addToCart(Request $request)
    // {
    //     try {


    //         // Step 1: Validate the request
    //         $validated = $request->validate([
    //             'product_id' => 'required|exists:products,id',
    //             'quantity' => 'required|integer|min:1',
    //             'customer_id' => 'required|exists:customers,customer_id', // Assuming you have a customers table
    //         ]);

    //         // Step 2: Check for existing cart item
    //         $cartItem = Cart::where('product_id', $request->product_id)
    //             ->where('customer_id', $request->customer_id)
    //             ->first();

    //         if ($cartItem) {
    //             // Step 3a: Update existing cart item
    //             $cartItem->quantity += $request->quantity;
    //         } else {
    //             // Step 3b: Create new cart item
    //             $cartItem = new Cart([
    //                 'product_id' => $request->product_id,
    //                 'quantity' => $request->quantity,
    //                 'customer_id' => $request->customer_id,
    //             ]);
    //         }

    //         // Save the cart item
    //         $cartItem->save();

    //         // Step 4: Return a response
    //         return response()->json([
    //             'message' => 'Product added to cart successfully',
    //             'cartItem' => $cartItem,
    //         ], 200);
    //     } catch (\Exception $e) {
    //         Log::error('Error adding to cart: ' . $e->getMessage());
    //         return response()->json(['error' => 'An error occured'], 500);
    //     }
    // }
}
