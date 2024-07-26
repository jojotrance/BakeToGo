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
            $query = Order::with(['products'])->where('customer_id', $user->id);
            
            if ($request->has('status') && $request->status != 'all') {
                $query->where('status', $request->status);
            }
            
            $orders = $query->get();
    
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


    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $customer = $user->customer;

        $request->validate([
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'contact' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        $customer->fname = $request->fname;
        $customer->lname = $request->lname;
        $user->email = $request->email;
        $customer->contact = $request->contact;
        $customer->address = $request->address;

        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $user->profile_image = $path;
        }

        $user->save();
        $customer->save();

        return response()->json(['message' => 'Profile updated successfully']);
    }

    public function show()
    {
        return response()->json(Auth::user()->load('customer'));
    }
    
}
