<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query();

        if ($request->has('search') && $request->search['value']) {
            $searchTerm = $request->search['value'];
            $query->where('supplier_name', 'like', "%{$searchTerm}%");
        }

        $suppliers = $query->paginate($request->get('length', 10), ['*'], 'page', $request->get('start', 0) / $request->get('length', 10) + 1);
        
        return response()->json([
            'data' => SupplierResource::collection($suppliers),
            'recordsTotal' => $suppliers->total(),
            'recordsFiltered' => $suppliers->total()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required|string|max:255|unique:suppliers,supplier_name',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $imagePath = $request->file('image')->store('suppliers', 'public');

            $supplier = Supplier::create([
                'supplier_name' => $request->supplier_name,
                'image' => $imagePath
            ]);

            return response()->json([
                'message' => 'Supplier created successfully',
                'supplier' => new SupplierResource($supplier)
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create supplier'], 500);
        }
    }

    public function show(Supplier $supplier)
    {
        return new SupplierResource($supplier);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('suppliers')->ignore($supplier->id),
            ],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $supplier->supplier_name = $request->supplier_name;

            if ($request->hasFile('image')) {
                Storage::disk('public')->delete($supplier->image);
                $imagePath = $request->file('image')->store('suppliers', 'public');
                $supplier->image = $imagePath;
            }

            $supplier->save();

            return response()->json([
                'message' => 'Supplier updated successfully',
                'supplier' => new SupplierResource($supplier)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update supplier'], 500);
        }
    }

    public function destroy(Supplier $supplier)
    {
        try {
            Storage::disk('public')->delete($supplier->image);
            $supplier->delete();

            return response()->json(['message' => 'Supplier deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete supplier'], 500);
        }
    }

    public function checkSupplierExistence(Request $request)
    {
        $supplierName = $request->query('supplier_name');
        $exists = Supplier::where('supplier_name', $supplierName)->exists();

        return response()->json(['exists' => $exists]);
    }

   

}