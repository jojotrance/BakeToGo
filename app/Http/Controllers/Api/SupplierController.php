<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::get();
        if ($suppliers->count() > 0) {
            return SupplierResource::collection($suppliers);
        } else {
            return response()->json(['message' => 'no records'], 200);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        $supplier = new Supplier();
        $supplier->supplier_name = $validated['supplier_name'];
        
        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();  
            $request->image->move(public_path('images'), $imageName);
            $supplier->image = $imageName;
        }
        
        $supplier->save();
    
        // Create default stock entry
        Stock::create([
            'quantity' => 0,
            'supplier_id' => $supplier->id,
        ]);
    
        return response()->json(['success' => true, 'data' => $supplier], 201);
    }
    
    public function show(Supplier $supplier)
    {
       
        return response()->json([
            'success' => true,
            'data' => new SupplierResource($supplier)
        ], 200);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $supplier->supplier_name = $request->supplier_name;

        if ($request->hasFile('image')) {
            // Delete old image
            if ($supplier->image) {
                Storage::delete('public/' . $supplier->image);
            }

            $imageName = time().'.'.$request->image->extension();  
            $request->image->move(public_path('storage'), $imageName);
            $supplier->image = $imageName;
        }

        $supplier->save();

        return response()->json([
            'success' => true,
            'message' => 'Supplier updated successfully',
            'data' => new SupplierResource($supplier)
        ], 200);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(['message' => 'Supplier deleted'], 200);
    }

    // app/Http/Controllers/Api/SupplierController.php

public function checkSupplierExistence(Request $request)
{
    $exists = Supplier::where('supplier_name', $request->supplier_name)->exists();
    return response()->json(['exists' => $exists]);
}

}
