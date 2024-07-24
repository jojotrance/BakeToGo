<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;    
use App\Models\Order;

class ReviewController extends Controller
{  
    public function history()
    {
        try {
            $user = Auth::user();
            // Fetch completed orders and their review status
            $orders = Order::with(['products'])
                ->where('customer_id', $user->id)
                ->where('status', 'completed')
                ->get();

            $reviews = $orders->map(function($order) {
                return [
                    'id' => $order->id,
                    'status' => 'not_reviewed', // Assuming 'not_reviewed' for simplicity
                    'product' => $order->products->map(function($product) {
                        return [
                            'image_url' => $product->image_url,
                            'name' => $product->name,
                            'description' => $product->description
                        ];
                    })
                ];
            });

            return response()->json(['reviews' => $reviews]);
        } catch (\Exception $e) {
            \Log::error('Error in ReviewController@history: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching your reviews.'], 500);
        }
    }
}
