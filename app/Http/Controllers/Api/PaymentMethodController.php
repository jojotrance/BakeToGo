<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentMethodResource;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentMethodController extends Controller
{
    public function listPaymentMethods(Request $request)
    {
        $query = PaymentMethod::query();

        if ($request->has('search') && !empty($request->input('search.value'))) {
            $searchValue = $request->input('search.value');
            $query->where(function ($q) use ($searchValue) {
                $q->where('payment_name', 'like', "%{$searchValue}%");
            });
        }

        if ($request->has('order')) {
            $orderColumn = $request->input('columns')[$request->input('order.0.column')]['data'];
            $orderDirection = $request->input('order.0.dir');
            $query->orderBy($orderColumn, $orderDirection);
        }

        $totalData = $query->count();

        $paymentmethods = $query->skip($request->input('start'))
            ->take($request->input('length'))
            ->get();

        return response()->json([
            'draw' => $request->input('draw'),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $paymentmethods
        ]);
    }

    public function viewPaymentMethod(PaymentMethod $paymentmethod)
    {
        return response()->json(['data' => $paymentmethod]);
    }

    public function createPaymentMethod(Request $request)
    {
        $validated = $request->validate([
            'payment_name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $paymentmethod = new PaymentMethod($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('paymentmethods', 'public');
            $paymentmethod->image = $path;
        }

        $paymentmethod->save();

        return response()->json(['data' => $paymentmethod]);
    }

    public function updatePaymentMethod(Request $request, PaymentMethod $paymentmethod)
    {
        $validated = $request->validate([
            'payment_name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $paymentmethod->fill($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('paymentmethods', 'public');
            $paymentmethod->image = $path;
        }

        $paymentmethod->save();

        return response()->json(['data' => $paymentmethod]);
    }

    public function destroyPaymentMethod(PaymentMethod $paymentmethod)
    {
        $paymentmethod->delete();

        return response()->json(['message' => 'Payment Method deleted successfully']);
    }
}
// {
//     public function index()
//     {
//         $paymentmethods = PaymentMethod::get();
//         if ($paymentmethods->count() > 0) {
//             return PaymentMethodResource::collection($paymentmethods);
//         } else {
//             return response()->json(['message' => 'no records'], 200);
//         }
//     }

//     public function store(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             'payment_name' => 'required',
//             'image' => 'required'
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['error' => $validator->errors()], 401);
//         }

//         $paymentmethod = PaymentMethod::create([
//             'payment_name' => $request->payment_name,
//             'image' => $request->image

//         ]);
//         return response()->json([
//             'message' => 'Payment Method created',
//             'data' => new PaymentMethodResource($paymentmethod)

//         ], 200);
//     }

//     public function show(PaymentMethod $paymentmethod)
//     {
//         return new PaymentMethodResource($paymentmethod);
//     }

//     public function update(Request $request, PaymentMethod $paymentmethod)
//     {
//         $validator = Validator::make($request->all(), [
//             'payment_name' => 'required',
//             'image' => 'required'
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['error' => $validator->errors()], 401);
//         }

//         $paymentmethod->update([
//             'payment_name' => $request->payment_name,
//             'image' => $request->image

//         ]);
//         return response()->json([
//             'message' => 'Payment Method updated',
//             'data' => new PaymentMethodResource($paymentmethod)

//         ], 200);
//     }

//     public function destroy(PaymentMethod $paymentmethod)
//     {
//         $paymentmethod->delete();
//         return response()->json(['message' => 'Payment Method deleted'], 200);
//     }
// }
