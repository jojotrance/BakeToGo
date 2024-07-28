<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\Courier;
use App\Models\Product; // Add this import

class AdminChartsController extends Controller
{
    public function totalRole()
    {
        return view('admin.pages.charts.totalRole');
    }

    public function courierPerBranch()
    {
        return view('admin.pages.charts.courierPerBranch');
    }

    public function totalSupplier()
    {
        return view('admin.pages.charts.totalSupplier');
    }

    public function totalCategory()
    {
        return view('admin.pages.charts.totalCategory');
    }

    public function getTotalSuppliers()
    {
        try {
            $total = Supplier::count();
            return response()->json(['total' => $total], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch total suppliers'], 500);
        }
    }

    public function getTotalCategory()
    {
        try {
            $categories = \DB::table('products')
                ->select('category', \DB::raw('COUNT(*) as total'))
                ->groupBy('category')
                ->get();

            return response()->json($categories, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch category data'], 500);
        }
    }
}
