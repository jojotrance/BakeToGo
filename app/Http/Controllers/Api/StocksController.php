<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stock;
use App\Http\Resources\StockResource;

class StocksController extends Controller
{
    public function index()
    {
        $stocks = Stock::with('supplier')->get();
        if ($stocks->isEmpty()) {
            return response()->json(['error' => 'No records found'], 404);
        }
        return StockResource::collection($stocks);
    }

    public function store(Request $request)
    {
        $stock = Stock::create($request->all());
        // Return a single StockResource instance
        return new StockResource($stock);
    }

    public function show($id)
    {
        // Find the stock and wrap it with StockResource
        $stock = Stock::with('supplier')->findOrFail($id);
        return new StockResource($stock);
    }

    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->all());
        // Return the updated stock as a StockResource
        return new StockResource($stock);
    }

    public function destroy($id)
    {
        Stock::destroy($id);
        // Return a 204 No Content response
        return response()->json(null, 204);
    }
}
