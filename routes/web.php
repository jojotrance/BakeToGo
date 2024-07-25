<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('/home', [HomeController::class, 'home']);
Route::get('/log', [HomeController::class, 'log']);

// Admin Routes
Route::group(['prefix' => 'admin', 'middleware' => ['auth', 'is_admin']], function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/orders', [AdminController::class, 'orders'])->name('orderindex');
    Route::get('/products', [AdminController::class, 'products'])->name('productindex');
    Route::get('/suppliers', [AdminController::class, 'suppliersindex'])->name('suppliersindex');
    Route::get('/courier', [AdminController::class, 'courier'])->name('courierindex');
    Route::get('/stock', [AdminController::class, 'stock'])->name('stock');  // Corrected typo
    Route::get('/payments', [AdminController::class, 'payments'])->name('payments');

    // Chart Routes
    Route::get('/pages/charts/total-role', function () {
        return view('admin.pages.charts.totalRole');
    })->name('charts.totalRole');
    Route::get('/pages/charts/customer-per-address', function () {
        return view('admin.pages.charts.customerPerAddress');
    })->name('charts.customerPerAddress');
    Route::get('/pages/charts/customer-per-branch', function () {
        return view('admin.pages.charts.customerPerBranch');
    })->name('charts.customerPerBranch');
    Route::get('/pages/charts/toral-supplier', function () {
        return view('admin.pages.charts.totalSupplier');
    })->name('charts.totalSupplier');

    Route::prefix('/users')->group(function () {
        Route::get('/', [AdminController::class, 'users'])->name('userindex');
    });
});

// Customer Routes
Route::group(['prefix' => 'customer', 'middleware' => ['auth', 'is_customer']], function () {
    Route::get('/dashboard', [CustomerController::class, 'showDashboard'])->name('customer.menu.dashboard');
    //  Route::get('/cart', [CartController::class, 'show'])->name('customer.cart.show');
    // Route::post('/cart', [CartController::class, 'addToCart']);
    // Profile routes
    Route::get('/profile', [CustomerController::class, 'profile'])->name('customer.profile.edit');
    Route::get('/purchase', [CustomerController::class, 'history'])->name('customer.history');
    Route::get('/myreviews', [CustomerController::class, 'myreviews'])->name('customer.myreviews');
    Route::post('/order/update-status', [CustomerController::class, 'updateOrderStatus'])->name('orders.updateStatus');
});
// Auth Routes
Route::group(['prefix' => 'auth', 'middleware' => 'guest'], function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::get('/signup', [AuthController::class, 'signup'])->name('signup');
});

Route::view('/shop', 'cust_dashboard');
Route::get('/mycarts', [ShopController::class, 'mycart'])->name('mycart');
Route::get('/checkoutDetails', [ShopController::class, 'checkoutDetails'])->name('checkoutDetails');
