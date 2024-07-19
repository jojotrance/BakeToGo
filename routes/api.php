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




Route::apiResource('products', ProductController::class);

Route::apiResource('suppliers', SupplierController::class);

Route::apiResource('paymentmethods', PaymentMethodController::class);

Route::apiResource('couriers', CourierController::class);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route pages
Route::prefix('auth')->middleware(['web'])->group(function () {
    Route::post('/register-user', [AuthController::class, 'registerUser'])->name('api.register-user');
    Route::post('/authenticate', [AuthController::class, 'authenticate'])->name('api.authenticate');
    Route::post('/check-email', [AuthController::class, 'checkEmail'])->name('api.check-email');
    Route::post('/check-username', [AuthController::class, 'checkUsername'])->name('api.check-username');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::get('/user-profile', [AuthController::class, 'getUserProfile'])->name('api.user-profile');
    Route::get('/user/profile', [UserController::class, 'profile']);
});

Route::get('/public-route', function () {
    return response()->json(['message' => 'This is a public route accessible to all']);
});

// User Management Routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::prefix('users')->group(function () {

    Route::post('/saveUser', [UserManagementController::class, 'saveUser'])->name('api.admin.saveUser');
    Route::get('/user/{id}', [UserManagementController::class, 'getEditUserData'])->name('api.admin.getEditUserData');
    Route::delete('/users/delete/{id}', [UserManagementController::class, 'deleteUser'])->name('api.admin.deleteUser');
    Route::post('/updateUserData', [UserManagementController::class, 'updateUserData'])->name('api.admin.updateUserData');
    Route::post('/store', [UserManagementController::class, 'storeUser'])->name('api.admin.storeUser');
    Route::get('/fetchUsers', [UserManagementController::class, 'fetchUsers'])->name('api.admin.fetchUsers');
    Route::post('/import', [SpreadsheetController::class, 'importUsers'])->name('api.admin.importUsers');
    Route::get('/export', [SpreadsheetController::class, 'exportUsers'])->name('api.admin.exportUsers');
});
    Route::prefix('/products')->group(function () {
        Route::post('/storeProducts', [ProductController::class, 'store'])->name('api.admin.storeProduct');
        Route::get('/fetchProducts', [ProductController::class, 'index'])->name('api.admin.fetchProducts');
        Route::get('/{product}', [ProductController::class, 'show'])->name('api.admin.showProduct');
        Route::put('/{product}', [ProductController::class, 'update'])->name('api.admin.updateProduct');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('api.admin.deleteProduct');
    });
 // routes/api.php

Route::prefix('suppliers')->group(function () {
    Route::post('/storeSuppliers', [SupplierController::class, 'store'])->name('api.admin.storeSupplier');
    Route::get('/fetchSuppliers', [SupplierController::class, 'index'])->name('api.admin.fetchSuppliers');
    Route::get('/{supplier}', [SupplierController::class, 'show'])->name('api.admin.showSupplier');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('api.admin.updateSupplier');
    Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('api.admin.deleteSupplier');
    Route::post('/checkSupplierExistence', [SupplierController::class, 'checkSupplierExistence'])->name('api.admin.checkSupplierExistence');
});


    Route::prefix('stocks')->group(function () {
        Route::post('/storeStocks', [StocksController::class, 'store'])->name('api.admin.storeStock');
        Route::get('/fetchStocks', [StocksController::class, 'index'])->name('api.admin.fetchStocks');
        Route::get('/{stock}', [StocksController::class, 'show'])->name('api.admin.showStock');
        Route::put('/{stock}', [StocksController::class, 'update'])->name('api.admin.updateStock');
        Route::delete('/{stock}', [StocksController::class, 'destroy'])->name('api.admin.deleteStock');

        Route::post('/create-default', [StocksController::class, 'createDefaultStock'])->name('api.admin.createDefaultStock');

    });
});
