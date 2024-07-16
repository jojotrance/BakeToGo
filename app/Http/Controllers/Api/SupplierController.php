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
        $suppliers = Supplier::get();
        if ($suppliers->count() > 0) {
            return SupplierResource::collection($suppliers);
        } else {
            return response()->json(['message' => 'no records'], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required',
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $supplier = Supplier::create([
            'supplier_name' => $request->supplier_name,
            'image' => $request->image

        ]);
        return response()->json([
            'message' => 'Supplier created',
            'data' => new SupplierResource($supplier)

        ], 200);
    }

    public function show(Supplier $supplier)
    {
        return new SupplierResource($supplier);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validator = Validator::make($request->all(), [
            'supplier_name' => 'required',
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $supplier->update([
            'supplier_name' => $request->supplier_name,
            'image' => $request->image

        ]);
        return response()->json([
            'message' => 'Supplier updated',
            'data' => new SupplierResource($supplier)

        ], 200);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(['message' => 'Supplier deleted'], 200);
    }
}
