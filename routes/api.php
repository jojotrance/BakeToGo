<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SpreadsheetController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\StocksController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// API Resources
Route::apiResource('products', ProductController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('payment-methods', PaymentMethodController::class);
Route::apiResource('admin/users', UserManagementController::class)->except(['create', 'edit']);
Route::apiResource('couriers', CourierController::class);

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
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::apiResource('stocks', StocksController::class);

});

// Public route
Route::get('/public-route', function () {
    return response()->json(['message' => 'This is a public route accessible to all']);
});

// Admin routes
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    // User Management Routes
    Route::prefix('users')->group(function () 
    {
        Route::post('/', [UserManagementController::class, 'store'])->name('api.admin.storeUser');
        Route::get('/', [UserManagementController::class, 'index'])->name('api.admin.fetchUsers');
        Route::get('/{user}', [UserManagementController::class, 'show'])->name('api.admin.showUser');
        Route::put('/{user}', [UserManagementController::class, 'update'])->name('api.admin.updateUser');
        Route::delete('/{user}', [UserManagementController::class, 'destroy'])->name('api.admin.deleteUser');
        Route::post('/import', [SpreadsheetController::class, 'importUsers'])->name('api.admin.importUsers');
        Route::get('/export', [SpreadsheetController::class, 'exportUsers'])->name('api.admin.exportUsers');
    });

    // Products Routes
    Route::prefix('products')->group(function () {
        Route::post('/', [ProductController::class, 'store'])->name('api.admin.storeProduct');
        Route::get('/', [ProductController::class, 'index'])->name('api.admin.fetchProducts');
        Route::get('/{product}', [ProductController::class, 'show'])->name('api.admin.showProduct');
        Route::put('products/{product}', [ProductController::class, 'update']);
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('api.admin.deleteProduct');
    });

    // Suppliers Routes
    Route::prefix('suppliers')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('api.admin.fetchSuppliers');
        Route::post('/', [SupplierController::class, 'store'])->name('api.admin.storeSupplier');
        Route::get('/{supplier}', [SupplierController::class, 'show'])->name('api.admin.showSupplier');
        Route::put('/{supplier}', [SupplierController::class, 'update'])->name('api.admin.updateSupplier');
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('api.admin.deleteSupplier');
        Route::get('/check-existence', [SupplierController::class, 'checkSupplierExistence'])->name('api.admin.checkSupplierExistence');
    });

    // Stocks Routes
    Route::prefix('stocks')->group(function () {
        Route::post('/', [StocksController::class, 'store'])->name('api.admin.storeStock');
        Route::get('/', [StocksController::class, 'index'])->name('api.admin.fetchStocks');
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
