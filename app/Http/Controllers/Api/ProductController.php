<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Stock;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('stocks')->get(); // Ensure we load the stocks relationship
        return response()->json([
            'data' => ProductResource::collection($products)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|integer',
            'category' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        $imageName = time() . '.' . $request->image->extension();
        $request->image->storeAs('public/product_images', $imageName);

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'stock' => 0,
            'image' => $imageName
        ]);

        // Create corresponding stock entry
        Stock::create([
            'product_id' => $product->id,
            'quantity' => 0,
            'supplier_id' => null
        ]);

        // Update product's stock field directly
        $product->stock = 0;
        $product->save();

        return response()->json(['success' => 'Product created successfully', 'data' => new ProductResource($product)], 200);
    }

    public function show(Product $product)
    {
        return response()->json(['data' => new ProductResource($product)]);
    }

    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|integer',
            'category' => 'required',
            'stock' => 'required|integer', // Validate the stock field
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        try {
            if ($request->hasFile('image')) {
                $imageName = time() . '.' . $request->image->extension();
                $request->image->storeAs('public/product_images', $imageName);
                $product->image = $imageName;
            }

            $product->update($request->only(['name', 'description', 'price', 'category', 'stock']));

            // Update the stock
            $stock = Stock::where('product_id', $product->id)->first();
            if ($stock) {
                $stock->update(['quantity' => $request->stock]);
            } else {
                Stock::create([
                    'product_id' => $product->id,
                    'quantity' => $request->stock,
                    'supplier_id' => null // Adjust this according to your needs
                ]);
            }

            // Update product's stock field directly
            $product->stock = $request->stock;
            $product->save();

            return response()->json([
                'message' => 'Product updated',
                'data' => new ProductResource($product->load('stocks')) // Load the stocks relationship
            ], 200);
        } catch (\Exception $e) {
            Log::error('Product update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Product update failed'], 500);
        }
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();
            return response()->json(['message' => 'Product deleted'], 200);
        } catch (\Exception $e) {
            Log::error('Product deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Product deletion failed'], 500);
        }
    }
}
