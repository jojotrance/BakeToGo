<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentMethodResource;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $paymentmethods = PaymentMethod::get();
        if ($paymentmethods->count() > 0) {
            return PaymentMethodResource::collection($paymentmethods);
        } else {
            return response()->json(['message' => 'no records'], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_name' => 'required',
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $paymentmethod = PaymentMethod::create([
            'payment_name' => $request->payment_name,
            'image' => $request->image

        ]);
        return response()->json([
            'message' => 'Payment Method created',
            'data' => new PaymentMethodResource($paymentmethod)

        ], 200);
    }

    public function show(PaymentMethod $paymentmethod)
    {
        return new PaymentMethodResource($paymentmethod);
    }

    public function update(Request $request, PaymentMethod $paymentmethod)
    {
        $validator = Validator::make($request->all(), [
            'payment_name' => 'required',
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $paymentmethod->update([
            'payment_name' => $request->payment_name,
            'image' => $request->image

        ]);
        return response()->json([
            'message' => 'Payment Method updated',
            'data' => new PaymentMethodResource($paymentmethod)

        ], 200);
    }

    public function destroy(PaymentMethod $paymentmethod)
    {
        $paymentmethod->delete();
        return response()->json(['message' => 'Payment Method deleted'], 200);
    }
}
