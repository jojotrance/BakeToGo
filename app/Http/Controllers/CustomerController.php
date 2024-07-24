<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function showDashboard()
    {
        return view('customer.pages.cust_dashboard');
    }

    public function cart()
    {
        return view('customer.cart');
    }

    public function profile()
    {
        return view('customer.pages.profile.profile');
    }

    public function myreviews(){
        return view('customer.pages.myReviews.myreviews');
    }

    public function history(){
        return view('customer.pages.history.history');
    }
}
