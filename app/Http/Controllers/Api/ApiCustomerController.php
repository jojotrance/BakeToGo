<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class ApiCustomerController extends Controller
{
    /**
     * Fetch order history for the authenticated customer.
     */
    public function history(Request $request)
    {
        try {
            $user = Auth::user();
            $orders = Order::with(['products'])
                ->where('customer_id', $user->id)
                ->get();
    
            return response()->json(['orders' => $orders]);
        } catch (\Exception $e) {
            \Log::error('Error in ApiCustomerController@history: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching your orders.'], 500);
        }
    }

    public function updateOrderStatus(Request $request)
    {
        try {
            $order = Order::findOrFail($request->order_id);
            $order->status = $request->status;
            $order->save();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            \Log::error('Error in ApiCustomerController@updateOrderStatus: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while updating the order status.'], 500);
        }
    }

    /**
     * Update the status of an order.
     */
    
}
