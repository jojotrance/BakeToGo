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
        $couriers = Courier::get();
        if ($couriers->count() > 0) {
            return CourierResource::collection($couriers);
        } else {
            return response()->json(['message' => 'no records'], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'courier_name' => 'required',
            'branch' => 'required',
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $courier = Courier::create([
            'courier_name' => $request->courier_name,
            'branch' => $request->branch,
            'image' => $request->image

        ]);
        return response()->json([
            'message' => 'Courier created',
            'data' => new CourierResource($courier)

        ], 200);
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
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $courier->update([
            'courier_name' => $request->courier_name,
            'branch' => $request->branch,
            'image' => $request->image
        ]);
        return response()->json([
            'message' => 'Courier created',
            'data' => new CourierResource($courier)

        ], 200);
    }

    public function destroy(Courier $courier)
    {
        $courier->delete();
        return response()->json(['message' => 'Courier deleted'], 200);
    }
}
