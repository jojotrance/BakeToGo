<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourierResource;
use App\Models\Courier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Imports\CourierImport;
use Maatwebsite\Excel\Facades\Excel;

class CourierController extends Controller
{
    public function listCouriers(Request $request)
    {
        $query = Courier::query();

        if ($request->has('search') && !empty($request->input('search.value'))) {
            $searchValue = $request->input('search.value');
            $query->where(function($q) use ($searchValue) {
                $q->where('courier_name', 'like', "%{$searchValue}%")
                  ->orWhere('branch', 'like', "%{$searchValue}%");
            });
        }

        if ($request->has('order')) {
            $orderColumn = $request->input('columns')[$request->input('order.0.column')]['data'];
            $orderDirection = $request->input('order.0.dir');
            $query->orderBy($orderColumn, $orderDirection);
        }

        $totalData = $query->count();

        $couriers = $query->skip($request->input('start'))
                          ->take($request->input('length'))
                          ->get();

        return response()->json([
            'draw' => $request->input('draw'),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $couriers
        ]);
    }

    public function viewCourier(Courier $courier)
    {
        return response()->json(['data' => $courier]);
    }

    public function createCourier(Request $request)
    {
        $validated = $request->validate([
            'courier_name' => 'required|string|max:255',
            'branch' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $courier = new Courier($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('couriers', 'public');
            $courier->image = $path;
        }

        $courier->save();

        return response()->json(['data' => $courier]);
    }

    public function updateCourier(Request $request, Courier $courier)
    {
        $validated = $request->validate([
            'courier_name' => 'required|string|max:255',
            'branch' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $courier->fill($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('couriers', 'public');
            $courier->image = $path;
        }

        $courier->save();

        return response()->json(['data' => $courier]);
    }

    public function destroyCourier(Courier $courier)
    {
        $courier->delete();

        return response()->json(['message' => 'Courier deleted successfully']);
    }

    public function getCourierPerBranch()
    {
        $courierData = Courier::select('branch', \DB::raw('count(*) as total'))
                              ->groupBy('branch')
                              ->get();

        return response()->json($courierData);
    }

    public function courierImport(Request $request)
    {
        $request->validate([
            'item_upload' => [
                'required',
                'file'
            ],
        ]);

        Excel::import(new CourierImport, $request->file('item_upload'));
        return redirect('/admin/courier')->with('success', 'Excel file Imported Successfully');
    }
}

