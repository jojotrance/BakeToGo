<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourierResource;
use App\Models\Courier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourierController extends Controller
{
    public function index()
    {
        $couriers = Courier::all();
        return CourierResource::collection($couriers);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'courier_name' => 'required',
            'branch' => 'required',
            'image' => 'required|image'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $imagePath = $request->file('image')->store('couriers', 'public');

        $courier = Courier::create([
            'courier_name' => $request->courier_name,
            'branch' => $request->branch,
            'image' => $imagePath
        ]);

        return response()->json(['message' => 'Courier created', 'data' => new CourierResource($courier)], 201);
    }

    public function show(Courier $courier)
    {
        return new CourierResource($courier);
    }

    public function update(Request $request, Courier $courier)
    {
        $validator = Validator::make($request->all(), [
            'courier_name' => 'required',
            'branch' => 'required',
            'image' => 'nullable|image'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('couriers', 'public');
            $courier->update([
                'courier_name' => $request->courier_name,
                'branch' => $request->branch,
                'image' => $imagePath
            ]);
        } else {
            $courier->update($request->only(['courier_name', 'branch']));
        }

        return response()->json(['message' => 'Courier updated', 'data' => new CourierResource($courier)], 200);
    }

    public function destroy(Courier $courier)
    {
        $courier->delete();
        return response()->json(['message' => 'Courier deleted'], 200);
    }
}
