<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Models\Customer;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
        $user = Auth::user();

        $customer = $user->customer;

        $product_id = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $cartItems = $customer->products()->where('product_id', $product_id)->first();

        if ($cartItems) {
            $customer->products()->updateExistingPivot($product_id, ['quantity' => $cartItems->pivot->quantity + $quantity]);
        } else {
            $customer->products()->attach($product_id, ['quantity' => $quantity]);
        }
        $updatedCartItem = $customer->products()->where('product_id', $product_id)->first();
        return response()->json(['message' => 'Successfully added to cart!', 'cartItems' => $updatedCartItem]);
    }

    public function mycart()
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
        return view('cart', compact('mycarts'));
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

    public function checkout(Request $request)
    {
        $user = Auth::user();
        $customerId = $user->customer->id;

        try {
            DB::beginTransaction();

            $order = new Order();
            $order->customer_id = $customerId;
            $order->status = 'Processing';
            $order->payment_id = $request->payment_id;
            $order->courier_id = $request->courier_id;
            $order->save();

            $cartItems = DB::table('carts')
                ->where('customer_id', $customerId)
                ->get();

            foreach ($cartItems as $cartItem) {
                $stock = Stock::where('product_id', $cartItem->product_id)->firstOrFail();
                if ($stock->quantity < $cartItem->quantity) {
                    throw new \Exception('Not enough stock for this product: ' . $cartItem->product_id);
                }

                $order->products()->attach($cartItem->product_id, [
                    'quantity' => $cartItem->quantity,
                    'order_id' => $order->id,
                ]);

                $stock->quantity -= $cartItem->quantity;
                $stock->save();
            }
            DB::commit();
            return response()->json([
                'status' => 'Order Success',
                'code' => 200,
                'orderId' => $order->id,
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'Order failed',
                'code' => 409,
                'error' => $e->getMessage(),
            ], 409);
        }
    }

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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}