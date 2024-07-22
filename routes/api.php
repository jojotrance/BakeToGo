<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ChartController;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SpreadsheetController;
use App\Http\Controllers\Api\StocksController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/addtoCart', [ShopController::class, 'addToCart']);
Route::post('/checkout', [ShopController::class, 'checkout']);

// API Resources
Route::apiResource('products', ProductController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('payment-methods', PaymentMethodController::class);
Route::apiResource('admin/users', UserManagementController::class)->except(['create', 'edit']);
Route::apiResource('couriers', CourierController::class);
// Route::apiResource('carts', CartController::class);
Route::apiResource('shop', ShopController::class);
//  Route::post('/cart', [CartController::class, 'addToCart'])->name('api.cart.addToCart')->middleware('auth:sanctum');
// Route::post('/cart/add', [CartController::class, 'addToCart'])->middleware('auth:api');

// Sanctum authenticated user route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register-user', [AuthController::class, 'registerUser'])->name('api.register-user');
    Route::post('/authenticate', [AuthController::class, 'authenticate'])->name('api.authenticate');
    Route::post('/check-email', [AuthController::class, 'checkEmail'])->name('api.check-email');
    Route::post('/check-username', [AuthController::class, 'checkUsername'])->name('api.check-username');
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::get('/user-profile', [AuthController::class, 'getUserProfile'])->name('api.user-profile');
    Route::apiResource('stocks', StocksController::class);
});

// Public route
Route::get('/public-route', function () {
    return response()->json(['message' => 'This is a public route accessible to all']);
});

// Admin routes
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {

    // User Management Routes
    Route::prefix('users')->group(function () {
        Route::post('/', [UserManagementController::class, 'store'])->name('api.admin.storeUser');
        Route::get('/', [UserManagementController::class, 'index'])->name('api.admin.fetchUsers');
        Route::get('/{user}', [UserManagementController::class, 'show'])->name('api.admin.showUser');
        Route::put('/{user}', [UserManagementController::class, 'update'])->name('api.admin.updateUser');
        Route::delete('/{user}', [UserManagementController::class, 'destroy'])->name('api.admin.deleteUser');
        Route::post('/import', [SpreadsheetController::class, 'importUsers'])->name('api.admin.importUsers');
        Route::get('/export', [SpreadsheetController::class, 'exportUsers'])->name('api.admin.exportUsers');
    });

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('api.admin.fetchProducts');
        Route::post('/', [ProductController::class, 'store'])->name('api.admin.storeProduct');
        Route::get('/{product}', [ProductController::class, 'show'])->name('api.admin.showProduct');
        Route::put('/{product}', [ProductController::class, 'update'])->name('api.admin.updateProduct');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('api.admin.deleteProduct');
        Route::get('/check-duplicate-name', [ProductController::class, 'checkDuplicateName'])->name('api.admin.checkDuplicateName'); // Use GET method
    });

    // Suppliers Routes
    Route::prefix('suppliers')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('api.admin.fetchSuppliers');
        Route::post('/', [SupplierController::class, 'store'])->name('api.admin.storeSupplier');
        Route::get('/{supplier}', [SupplierController::class, 'show'])->name('api.admin.showSupplier');
        Route::put('/{supplier}', [SupplierController::class, 'update'])->name('api.admin.updateSupplier');
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('api.admin.deleteSupplier');
    });

    // Stocks Routes
    Route::prefix('stocks')->group(function () {
        Route::get('/', [StocksController::class, 'index'])->name('api.admin.fetchStocks');
        Route::post('/', [StocksController::class, 'store'])->name('api.admin.storeStock');
        Route::get('/{stock}', [StocksController::class, 'show'])->name('api.admin.showStock');
        Route::put('/{stock}', [StocksController::class, 'update'])->name('api.admin.updateStock');
        Route::delete('/{stock}', [StocksController::class, 'destroy'])->name('api.admin.deleteStock');
    });

    // Couriers Routes
    Route::prefix('couriers')->group(function () {
        Route::post('/create', [CourierController::class, 'createCourier'])->name('api.admin.createCourier');
        Route::get('/list', [CourierController::class, 'listCouriers'])->name('api.admin.listCouriers');
        Route::get('/view/{courier}', [CourierController::class, 'viewCourier'])->name('api.admin.viewCourier');
        Route::put('/update/{courier}', [CourierController::class, 'updateCourier'])->name('api.admin.updateCourier');
        Route::delete('/destroy/{courier}', [CourierController::class, 'destroyCourier'])->name('api.admin.destroyCourier');
    });
});

// Chart Routes
//Route::get('/charts/total-role', [ChartController::class, 'totalRole'])->name('api.charts.totalRole');
//Route::get('/charts/customer-per-address', [ChartController::class, 'customerPerAddress'])->name('api.charts.customerPerAddress');
//Route::get('/charts/customer-per-branch', [ChartController::class, 'customerPerBranch'])->name('api.charts.customerPerBranch');
//Route::get('/charts/totalSupplier', [ChartController::class, 'totalSupplier'])->name('api.charts.totalSupplier');

Route::group(['middleware' => ['auth:sanctum', 'is_customer']], function () {
    Route::get('/profile', [UserProfileController::class, 'show'])->name('api.customer.profile.show');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('api.customer.profile.update');
    Route::post('/profile/deactivate', [UserProfileController::class, 'deactivate'])->name('api.customer.profile.deactivate');
    Route::delete('/profile', [UserProfileController::class, 'destroy'])->name('api.customer.profile.destroy');
});
