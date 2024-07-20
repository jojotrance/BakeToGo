<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockResource;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StocksController extends Controller
{
    public function index()
    {
        try {
            $stocks = Stock::with(['product', 'supplier'])->get();
            return StockResource::collection($stocks);
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
            $stock = Stock::updateOrCreate(
                ['product_id' => $validatedData['product_id']],
                $validatedData
            );

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

            return response()->json(['success' => true, 'data' => new StockResource($stock)]);
        } catch (\Exception $e) {
            Log::error('Failed to update stock: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update stock'], 500);
        }
    }

    public function destroy(Stock $stock)
    {
        try {
            $stock->delete();
            return response()->json(['success' => true, 'message' => 'Stock deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to delete stock: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete stock'], 500);
        }
    }
}
