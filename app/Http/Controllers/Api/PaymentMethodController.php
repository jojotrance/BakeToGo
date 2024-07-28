<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PaymentMethodResource;
use Illuminate\Support\Facades\Log;
use App\Imports\PaymentMethodImport;
use Maatwebsite\Excel\Facades\Excel;

class PaymentMethodController extends Controller
{
    public function listPaymentMethods(Request $request)
    {
        try {
            $query = PaymentMethod::query();

            if ($request->has('search') && !empty($request->input('search.value'))) {
                $searchValue = $request->input('search.value');
                $query->where('payment_name', 'like', "%{$searchValue}%");
            }

            if ($request->has('order')) {
                $orderColumn = $request->input('columns')[$request->input('order.0.column')]['data'];
                $orderDirection = $request->input('order.0.dir');
                $query->orderBy($orderColumn, $orderDirection);
            }

            $start = $request->input('start', 0);
            $length = $request->input('length', 10);

            $totalData = $query->count();
            $paymentMethods = $query->skip($start)->take($length)->get();

            return response()->json([
                'draw' => $request->input('draw'),
                'recordsTotal' => $totalData,
                'recordsFiltered' => $totalData,
                'data' => PaymentMethodResource::collection($paymentMethods)
            ]);
        } catch (\Exception $e) {
            Log::error('Payment Method listing error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        }
    }

    public function createPaymentMethod(Request $request)
    {
        try {
            Log::info('Request data:', $request->all());

            $validator = Validator::make($request->all(), [
                'payment_name' => 'required|string|max:255',
                'image' => 'nullable|image|max:2048',
            ]);

            if ($validator->fails()) {
                Log::error('Validation errors:', ['errors' => $validator->errors()->toArray()]);
                return response()->json(['error' => $validator->errors()], 401);
            }

            $paymentMethod = new PaymentMethod([
                'payment_name' => $request->payment_name,
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('paymentmethods', 'public');
                $paymentMethod->image = $path;
            }

            $paymentMethod->save();

            Log::info('Payment method created:', ['paymentMethod' => $paymentMethod->toArray()]);

            return response()->json([
                'message' => 'Payment Method created',
                'data' => new PaymentMethodResource($paymentMethod)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Payment Method creation error:', [
                'message' => $e->getMessage(),
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'An error occurred while creating the payment method.'], 500);
        }
    }

    public function viewPaymentMethod(PaymentMethod $paymentMethod)
    {
        try {
            return new PaymentMethodResource($paymentMethod);
        } catch (\Exception $e) {
            Log::error('Payment Method view error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'An error occurred while fetching the payment method.'], 500);
        }
    }

    public function updatePaymentMethod(Request $request, PaymentMethod $paymentMethod)
    {
        try {
            Log::info('Request data for update:', $request->all());

            $validator = Validator::make($request->all(), [
                'payment_name' => 'required|string|max:255|unique:payment_methods,payment_name,' . $paymentMethod->id,
                'image' => 'nullable|image|max:2048',
            ]);

            if ($validator->fails()) {
                Log::error('Validation errors for update:', ['errors' => $validator->errors()->toArray()]);
                return response()->json(['error' => $validator->errors()], 401);
            }

            $paymentMethod->payment_name = $request->payment_name;

            if ($request->hasFile('image')) {
                if ($paymentMethod->image) {
                    Storage::disk('public')->delete($paymentMethod->image);
                }
                $path = $request->file('image')->store('paymentmethods', 'public');
                $paymentMethod->image = $path;
            }

            $paymentMethod->save();

            Log::info('Payment method updated:', ['paymentMethod' => $paymentMethod->toArray()]);

            return response()->json([
                'message' => 'Payment Method updated',
                'data' => new PaymentMethodResource($paymentMethod)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Payment Method update error:', [
                'message' => $e->getMessage(),
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'An error occurred while updating the payment method.'], 500);
        }
    }

    public function destroyPaymentMethod(PaymentMethod $paymentMethod)
    {
        try {
            if ($paymentMethod->image) {
                Storage::disk('public')->delete($paymentMethod->image);
            }

            $paymentMethod->delete();

            return response()->json(['message' => 'Payment Method deleted'], 200);
        } catch (\Exception $e) {
            Log::error('Payment Method deletion error: ', [
                'message' => $e->getMessage(),
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'An error occurred while deleting the payment method.'], 500);
        }
    }

    public function paymentmethodImport(Request $request)
    {
        $request->validate([
            'item_upload' => [
                'required',
                'file'
            ],
        ]);

        Excel::import(new PaymentMethodImport, $request->file('item_upload'));
        return redirect('/admin/payments')->with('success', 'Excel file Imported Successfully');
    }
}
