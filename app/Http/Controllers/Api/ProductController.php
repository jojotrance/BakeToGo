<?php
namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Stock;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Imports\ProductImport;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{public function index(Request $request)
    {
        // Start the query with the relationship to stocks
        $query = Product::with('stocks');

        // Get the total number of records before applying filters
        $totalRecords = $query->count();

        // Handle search functionality
        if ($request->has('search') && $request->input('search.value')) {
            $searchTerm = $request->input('search.value');
            Log::info('Search term:', ['term' => $searchTerm]); // Log the search term
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('category', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Get the total number of records after applying filters but before pagination
        $totalFilteredRecords = $query->count();

        // Handle ordering
        if ($request->has('order')) {
            $orderColumnIndex = $request->input('order.0.column');
            $orderDir = $request->input('order.0.dir');
            $columns = $request->input('columns');
            $orderColumnName = $columns[$orderColumnIndex]['data'];

            $query->orderBy($orderColumnName, $orderDir);
        }

        // Handle pagination
        if ($request->has('length') && $request->input('length') != -1) {
            $length = $request->input('length');
            $start = $request->input('start');
            $query->offset($start)->limit($length);
        }

        $products = $query->get();

        // Calculate total stock for each product
        foreach ($products as $product) {
            $product->total_stock = $product->stocks->sum('quantity');
        }

        return response()->json([
            'data' => ProductResource::collection($products),
            'recordsTotal' => $totalRecords,
            'recordsFiltered' => $totalFilteredRecords,
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
            'image' => $imageName
        ]);

        Stock::create([
            'product_id' => $product->id,
            'quantity' => 0,
            'supplier_id' => null
        ]);

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
            'stock' => 'required|integer',
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

            $product->update($request->only(['name', 'description', 'price', 'category']));

            $stock = Stock::where('product_id', $product->id)->first();
            if ($stock) {
                $stock->update(['quantity' => $request->stock]);
            } else {
                Stock::create([
                    'product_id' => $product->id,
                    'quantity' => $request->stock,
                    'supplier_id' => null
                ]);
            }

            return response()->json([
                'message' => 'Product updated',
                'data' => new ProductResource($product->load('stocks'))
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

    public function checkDuplicateName(Request $request)
{
    $name = $request->input('name');
    $id = $request->input('id');

    $query = Product::where('name', $name);

    if ($id) {
        $query->where('id', '!=', $id);
    }

    $exists = $query->exists();

        return response()->json(['exists' => $exists]);
    }

    public function productImport(Request $request)
    {
        $request->validate([
            'item_upload' => [
                'required',
                'file'
            ],
        ]);

        Excel::import(new ProductImport, $request->file('item_upload'));
        return redirect('/admin/products')->with('success', 'Excel file Imported Successfully');
    }

    public function updateProductStock(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        // Fetch product
        $product = Product::findOrFail($productId);

        // Fetch the stock for the product from the supplier with the highest stock
        $stock = Stock::where('product_id', $productId)
                    ->orderBy('quantity', 'desc')
                    ->first();

        if (!$stock) {
            return response()->json(['message' => 'No stock available for this product'], 404);
        }

        if ($stock->quantity >= $quantity) {
            $stock->quantity -= $quantity;
            $stock->save();
        } else {
            return response()->json(['message' => 'Not enough stock available'], 400);
        }

        return response()->json(['message' => 'Stock updated successfully'], 200);
    }

    public function getProductsWithStock()
    {
        $products = Product::with(['stocks' => function ($query) {
            $query->selectRaw('product_id, SUM(quantity) as total_stock')
                  ->groupBy('product_id');
        }])->get();

        return response()->json(['data' => $products]);
    }
}
