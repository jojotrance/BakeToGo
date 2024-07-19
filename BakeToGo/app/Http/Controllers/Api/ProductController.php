<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Stock;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
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

        $imageName = time().'.'.$request->image->extension();  
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

        return response()->json(['success' => 'Product created successfully', 'data' => $product], 200);
    }

    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|integer',
            'category' => 'required',
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        try {
            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'category' => $request->category,
                'image' => $request->image
            ]);

            return response()->json([
                'message' => 'Product updated',
                'data' => new ProductResource($product)
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Product update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Product update failed'], 500);
        }
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();
            return response()->json(['message' => 'Product deleted'], 200);
        } catch (\Exception $e) {
            \Log::error('Product deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Product deletion failed'], 500);
        }
    }
}
