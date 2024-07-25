<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\Courier;

class AdminChartsController extends Controller
{
    public function totalRole()
    {
        return view('admin.pages.charts.totalRole');
    }

    public function customerPerAddress()
    {
        return view('admin.pages.charts.customerPerAddress');
    }

    public function courierPerBranch()
    {
        return view('admin.pages.charts.courierPerBranch');
    }

    public function totalSupplier()
    {
        return view('admin.pages.charts.totalSupplier');
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

   
}
