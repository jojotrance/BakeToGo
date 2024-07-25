<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockResource;
use App\Models\Stock;
use App\Events\StockUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StocksController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Stock::with(['product', 'supplier']);

            if ($request->has('search') && $request->search['value']) {
                $searchTerm = $request->search['value'];
                $query->whereHas('product', function($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%");
                })->orWhereHas('supplier', function($q) use ($searchTerm) {
                    $q->where('supplier_name', 'like', "%{$searchTerm}%");
                });
            }

            $stocks = $query->paginate(
                $request->get('length', 10), 
                ['*'], 
                'page', 
                $request->get('start', 0) / $request->get('length', 10) + 1
            );

            return response()->json([
                'data' => StockResource::collection($stocks),
                'recordsTotal' => $stocks->total(),
                'recordsFiltered' => $stocks->total()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch stocks: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch stocks'], 500);
        }
    }

    public function show(Stock $stock)
    {
        try {
            return new StockResource($stock->load('product', 'supplier'));
        } catch (\Exception $e) {
            Log::error('Failed to fetch stock details: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch stock details'], 500);
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        try {
            $stock = Stock::where('product_id', $validatedData['product_id'])
                ->where('supplier_id', $validatedData['supplier_id'])
                ->first();

            if ($stock) {
                $stock->quantity += $validatedData['quantity'];
                $stock->save();
            } else {
                $stock = Stock::create($validatedData);
            }

            // Trigger the stock updated event
            // event(new StockUpdated($stock->product));

            return response()->json(['success' => true, 'data' => new StockResource($stock)], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create or update stock: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create or update stock'], 500);
        }
    }

     public function update(Request $request, Stock $stock)
     {
         $validatedData = $request->validate([
             'quantity' => 'required|integer|min:0',
             'supplier_id' => 'nullable|exists:suppliers,id',
         ]);

         try {
             $stock->update($validatedData);

             // Trigger the stock updated event
             event(new StockUpdated($stock->product));

             return response()->json(['success' => true, 'data' => new StockResource($stock)]);
         } catch (\Exception $e) {
             Log::error('Failed to update stock: ' . $e->getMessage());
             return response()->json(['error' => 'Failed to update stock'], 500);
       }
 }

    public function destroy(Stock $stock)
    {
        try {
            $product = $stock->product;
            $stock->delete();

            // Trigger the stock updated event
            event(new StockUpdated($product));

            return response()->json(['success' => true, 'message' => 'Stock deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to delete stock: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete stock'], 500);
        }
    }
}
