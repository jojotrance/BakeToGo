<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;    
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            try {
                $orders = Order::with(['customer', 'paymentMethod', 'courier']);
                
                return DataTables::of($orders)
                    ->addColumn('customer', function (Order $order) {
                        return $order->customer ? $order->customer->fname . ' ' . $order->customer->lname : 'N/A';
                    })
                    ->addColumn('payment_method', function (Order $order) {
                        return $order->paymentMethod ? $order->paymentMethod->payment_name : 'N/A';
                    })
                    ->addColumn('courier', function (Order $order) {
                        return $order->courier ? $order->courier->courier_name : 'N/A';
                    })
                    ->addColumn('action', function ($order) {
                        return '<button type="button" class="edit btn btn-primary btn-sm" data-id="' . $order->id . '">Edit</button> ' .
                               '<button type="button" class="delete btn btn-danger btn-sm" data-id="' . $order->id . '">Delete</button>';
                    })
                    ->rawColumns(['action'])
                    ->make(true);
            } catch (\Exception $e) {
                \Log::error('Error in OrderController@index: ' . $e->getMessage());
                return response()->json(['error' => 'An error occurred while processing your request.'], 500);
            }
        }
    
        return view('admin.orders.index');
    }

    public function show($id)
    {
        try {
            $order = Order::with(['customer', 'paymentMethod', 'courier', 'products'])->findOrFail($id);
            return response()->json($order);
        } catch (\Exception $e) {
            Log::error('Error in OrderController@show: ' . $e->getMessage());
            return response()->json(['error' => 'Order not found or an error occurred.'], 404);
        }
    }

    public function updateStatus(Request $request, $orderId)
    {
        try {
            $request->validate([
                'status' => 'required|string',
            ]);

            $order = Order::findOrFail($orderId);
            $order->update([
                'status' => $request->input('status'),
            ]);

            return response()->json(['message' => 'Order status updated successfully']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in OrderController@updateStatus: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while updating the order status.'], 500);
        }
    }

    public function getOrderProducts($id)
    {
        try {
            $order = Order::with('products')->findOrFail($id);
            return response()->json($order->products);
        } catch (\Exception $e) {
            Log::error('Error in OrderController@getOrderProducts: ' . $e->getMessage());
            return response()->json(['error' => 'Order not found or an error occurred.'], 404);
        }
    }

    public function destroy($id)
    {
        try {
            $order = Order::findOrFail($id);
            $order->delete();
    
            return response()->json(['message' => 'Order deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error in OrderController@destroy: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while deleting the order.'], 500);
        }
    }
    
    
}
