<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Validator;


class AdminController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    public function orders()
    {
        return view('admin.pages.orders.orderindex');
    }

    public function products()
    {
        return view('admin.pages.products.productindex');
    }

    public function users()
    {
        return view('admin.pages.users.userindex');
    }

    public function suppliersindex()
    {
        return view('admin.pages.suppliers.supplierindex');
    }

    public function courier()
    {
        return view('admin.pages.courier.courierindex');
    }

    public function stock(){
        return view('admin.pages.stock.stockindex');
    }

    public function payments(){
        return view('admin.pages.payment.payment');
    }

}
