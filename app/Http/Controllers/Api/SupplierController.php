<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::all();
        return SupplierResource::collection($suppliers);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required',
            'image' => 'required|image'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $imagePath = $request->file('image')->store('suppliers', 'public');

        $supplier = Supplier::create([
            'supplier_name' => $request->supplier_name,
            'image' => $imagePath
        ]);

        return response()->json(['message' => 'Supplier created', 'data' => new SupplierResource($supplier)], 201);
    }

    public function show(Supplier $supplier)
    {
        return new SupplierResource($supplier);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required',
            'image' => 'nullable|image'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('suppliers', 'public');
            $supplier->update([
                'supplier_name' => $request->supplier_name,
                'image' => $imagePath
            ]);
        } else {
            $supplier->update($request->only(['supplier_name']));
        }

        return response()->json(['message' => 'Supplier updated', 'data' => new SupplierResource($supplier)], 200);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(['message' => 'Supplier deleted'], 200);
    }
    public function checkSupplierExistence(Request $request)
    {
        $supplierName = $request->query('supplier_name');
        
        $exists = Supplier::where('supplier_name', $supplierName)->exists();

        return response()->json(['exists' => $exists]);
    }
}
