<?php

namespace App\Http\Controllers;

use App\Http\Resources\SupplierTransactionResource;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Supplier_Transaction;
use Illuminate\Http\Request;

class SupplierTransactionController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = Supplier_Transaction::join('products as p', 'supplier_transaction.product_id', '=', 'p.id')
            ->join('suppliers as s', 'supplier_transaction.supplier_id', '=', 's.id')
            ->select('supplier_transaction.*', 's.supplier_name', 'p.name')
            ->whereNull('supplier_transaction.deleted_at') // Exclude soft-deleted records
            ->get(); // Retrieve all records without pagination

        return SupplierTransactionResource::collection($suppliers);
    }
}
