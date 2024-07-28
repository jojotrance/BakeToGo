<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Models\Customer;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Stock;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;



class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //public function index(Request $request)
//{
   // $products = Product::with('stocks')->paginate(10);
    //Log::debug('Products fetched:', ['products' => $products->toArray()]); // Add this line for debugging
    //return response()->json($products);
//}
public function index()
{
    $items = Product::all();
    return response()->json($items);
}

    /**
     * Show the form for creating a new resource.
     */  
    
     public function addToCart(Request $request)
     {
         $request->validate([
             'product_id' => 'required|integer|exists:products,id',
             'quantity' => 'required|integer|min:1'
         ]);
     
         $user = Auth::user();
         $customer = $user->customer;
     
         $product_id = $request->input('product_id');
         $quantity = $request->input('quantity', 1);
     
         $cartItem = $customer->products()->where('product_id', $product_id)->first();
     
         if ($cartItem) {
             // Increment the quantity instead of replacing it
             $newQuantity = $cartItem->pivot->quantity + $quantity;
             $customer->products()->updateExistingPivot($product_id, ['quantity' => $newQuantity]);
         } else {
             $customer->products()->attach($product_id, ['quantity' => $quantity]);
         }
     
         // Fetch the product to update stock
         $product = Product::findOrFail($product_id);
         $stock = $product->stocks()->where('quantity', '>', 0)->orderBy('quantity', 'desc')->first();
     
         if ($stock && $stock->quantity >= $quantity) {
             $stock->quantity -= $quantity;
             $stock->save();
         } else {
             return response()->json(['message' => 'Not enough stock available'], 400);
         }
     
         $updatedCartItem = $customer->products()->where('product_id', $product_id)->first();
         return response()->json(['message' => 'Successfully updated cart!', 'cartItems' => $updatedCartItem]);
     }
     
    
     public function mycart()
     {
         $user = Auth::id();
         $customer = Customer::where('user_id', $user)->first();
     
         if (!$customer) {
             return redirect()->back()->with('error', 'No customer found for the authenticated user.');
         }
     
         $mycarts = $customer->products()->with(['stocks' => function ($query) {
             $query->select('product_id', DB::raw('SUM(quantity) as total_stock'))
                   ->groupBy('product_id');
         }])->get();
     
         return view('cart', compact('mycarts'));
     }
     
     

    public function cartCount()
    {
        $user = Auth::user();
        $customer = $user->customer;

        $cartItemCount = $customer->products()->count();

        return response()->json(['count' => $cartItemCount]);
    }
    
    public function checkoutDetails()
    {
        $user = Auth::id();
        $customer = Customer::where('user_id', $user)->first();

        $customerId = $customer->id;


        $mycarts =  DB::table('carts')->join('products', 'products.id', '=', 'carts.product_id')
            ->leftJoin('stocks', 'stocks.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                'products.category',
                'products.price',
                'carts.customer_id as pivot_customer_id',
                'carts.product_id as pivot_product_id',
                'carts.quantity as pivot_quantity',
            )->where('carts.customer_id', $customerId)->get();

        $payments = PaymentMethod::all();
        $couriers = Courier::all();

        return view('checkout', compact('mycarts', 'couriers', 'payments', 'customer'));
    }

    public function updateCartQuantity(Request $request)
    {
        $user = Auth::user();
        $customer = $user->customer;

        $product_id = $request->input('product_id');
        $quantity = $request->input('quantity');    

        $cartItem = $customer->products()->where('product_id', $product_id)->first();

        if ($cartItem) {
            $customer->products()->updateExistingPivot($product_id, ['quantity' => $quantity]);
            $updatedCartItem = $customer->products()->where('product_id', $product_id)->first();
            return response()->json(['message' => 'Quantity updated successfully!', 'cartItems' => $updatedCartItem]);
        }

        return response()->json(['message' => 'Item not found in cart!'], 404);
    }
    public function removeFromCart(Request $request)
    {
        $user = Auth::user();
        $customer = $user->customer;
        $product_id = $request->input('product_id');

        $customer->products()->detach($product_id);

        return response()->json(['message' => 'Successfully removed from cart!']);
    }
    // public function checkout(Request $request)
    // {
    //     $user = Auth::user();
    //     $customerId = $user->customer->id;

    //     try {
    //         DB::beginTransaction();

    //         $order = new Order();
    //         $order->customer_id = $customerId;
    //         $order->status = 'Processing';
    //         $order->payment_id = $request->payment_method; // Assuming payment_method is correct
    //         $order->courier_id = $request->courier_id;
    //         $order->save();

    //         $cartItems = DB::table('carts')
    //             ->where('customer_id', $customerId)
    //             ->get();

    //         foreach ($cartItems as $cartItem) {
    //             $product = Product::findOrFail($cartItem->product_id);

    //             $stock = $product->stocks()->firstOrFail(); // Assuming you find the correct stock here
    //             if ($stock->quantity < $cartItem->quantity) {
    //                 throw new \Exception('Not enough stock for this product: ' . $product->id);
    //             }

    //             // Create order_product entry
    //             $order->products()->attach($product->id, [
    //                 'quantity' => $cartItem->quantity,
    //                 'order_id' => $order->id,
    //             ]);

    //             // Update stock quantity
    //             $stock->quantity -= $cartItem->quantity;
    //             $stock->save();
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'status' => 'Order Success',
    //             'code' => 200,
    //             'orderId' => $order->id,
    //         ]);
    //     } catch (\Exception $e) {
    //         DB::rollback();
    //         Log::error('Checkout error: ' . $e->getMessage());
    //         return response()->json([
    //             'status' => 'Order Failed',
    //             'code' => 500,
    //             'error' => $e->getMessage(),
    //         ]);
    //     }
    // }

    public function checkout(Request $request)
    {
        $user = Auth::user();
        $customerId = $user->customer->id;

        try {
            DB::beginTransaction();

            $order = new Order();
            $order->customer_id = $customerId;
            $order->status = 'Processing';
            $order->payment_id = $request->payment_method;
            $order->courier_id = $request->courier_id;
            $order->save();

            $cartItems = DB::table('carts')
                ->where('customer_id', $customerId)
                ->get();

            foreach ($cartItems as $cartItem) {
                $product = Product::findOrFail($cartItem->product_id);
                $stock = $product->stocks()->orderBy('quantity', 'desc')->first();

                if ($stock && $stock->quantity >= $cartItem->quantity) {
                    // Create order_product entry
                    $order->products()->attach($product->id, [
                        'quantity' => $cartItem->quantity,
                        'order_id' => $order->id,
                    ]);

                    // Update stock quantity
                    $stock->quantity -= $cartItem->quantity;
                    $stock->save();
                } else {
                    throw new \Exception('Not enough stock for this product: ' . $product->id);
                }
            }

            // Clear cart items after successful order
            DB::table('carts')
                ->where('customer_id', $customerId)
                ->delete();

            DB::commit();

            return response()->json([
                'status' => 'Order Success',
                'code' => 200,
                'orderId' => $order->id,
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Checkout error: ' . $e->getMessage());
            return response()->json([
                'status' => 'Order Failed',
                'code' => 500,
                'error' => $e->getMessage(),
            ]);
        }
    }
 


    // return response()->json([
    //     'status' => 'Order failed',
    //     'code' => 409,
    //     'error' => 'An error occurred during checkout. Please try again later.',
    // ], 409);

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the request data
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Find the cart item for the authenticated user
        $cart = Auth::user()->cart()->where('product_id', $id)->first();

        // Check if the cart item exists
        if ($cart) {
            // Update the quantity
            $cart->pivot->quantity = $validated['quantity'];
            $cart->pivot->save();

            // Return a success response
            return response()->json(['message' => 'Quantity updated successfully.']);
        } else {
            // Return a not found response if the item doesn't exist
            return response()->json(['message' => 'Item not found in cart.'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
