<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stock;
use App\Http\Resources\StockResource;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class StocksController extends Controller
{
    public function index()
    {
        $stocks = Stock::with(['product', 'supplier'])->get();

        $stocksData = $stocks->map(function ($stock) {
            return [
                'id' => $stock->id,
                'product_id' => $stock->product_id,
                'product_name' => $stock->product ? $stock->product->name : 'N/A',
                'quantity' => $stock->quantity,
                'supplier_name' => $stock->supplier ? $stock->supplier->name : 'N/A',
            ];
        });

        return response()->json(['data' => $stocksData]);
    }

    public function show(Stock $stock)
    {
        return response()->json($stock->load('product', 'supplier'));
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        $stock = Stock::updateOrCreate(
            ['product_id' => $validatedData['product_id']],
            $validatedData
        );

        return response()->json(['success' => true, 'data' => $stock]);
    }

    public function update(Request $request, Stock $stock)
    {
        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        $stock->update($validatedData);

        return response()->json(['success' => true, 'data' => $stock]);
    }

    public function destroy(Stock $stock)
    {
        $stock->delete();

        return response()->json(['success' => true, 'message' => 'Stock deleted successfully']);
    }
}
