<?php


use App\Http\Controllers\Api\ApiCustomerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChartController;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SpreadsheetController;
use App\Http\Controllers\Api\StocksController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReviewController;



// API Resources
Route::apiResource('products', ProductController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('payment-methods', PaymentMethodController::class);
Route::apiResource('admin/users', UserManagementController::class)->except(['create', 'edit']);
Route::apiResource('couriers', CourierController::class);
Route::apiResource('shop', ShopController::class);

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
        Route::put('/{user}/role', [UserManagementController::class, 'updateRole'])->name('api.admin.updateUserRole'); // Separate route for updating role
        Route::put('/{user}/active-status', [UserManagementController::class, 'updateActiveStatus'])->name('api.admin.updateUserActiveStatus'); // Separate route for updating active status
        Route::delete('/{user}', [UserManagementController::class, 'destroy'])->name('api.admin.deleteUser');
        Route::post('/import', [SpreadsheetController::class, 'importUsers'])->name('api.admin.importUsers');
        Route::get('/export', [SpreadsheetController::class, 'exportUsers'])->name('api.admin.exportUsers');
    });

    // Product Routes
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('api.admin.fetchProducts');
        Route::post('/', [ProductController::class, 'store'])->name('api.admin.storeProduct');
        Route::get('/{product}', [ProductController::class, 'show'])->name('api.admin.showProduct');
        Route::put('/{product}', [ProductController::class, 'update'])->name('api.admin.updateProduct');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('api.admin.deleteProduct');
        Route::get('/check-duplicate-name', [ProductController::class, 'checkDuplicateName'])->name('api.admin.checkDuplicateName'); // Use GET method
        Route::post('/updateProductStock', [ProductController::class, 'updateProductStock']);
       
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

    // Payment Methods Routes
    Route::prefix('payment-methods')->group(function () {
        Route::get('/', [PaymentMethodController::class, 'listPaymentMethods'])->name('api.admin.listPaymentMethods');
        Route::post('/', [PaymentMethodController::class, 'createPaymentMethod'])->name('api.admin.createPaymentMethod');
        Route::get('/{paymentMethod}', [PaymentMethodController::class, 'viewPaymentMethod'])->name('api.admin.viewPaymentMethod');
        Route::put('/{paymentMethod}', [PaymentMethodController::class, 'updatePaymentMethod'])->name('api.admin.updatePaymentMethod');
        Route::delete('/{paymentMethod}', [PaymentMethodController::class, 'destroyPaymentMethod'])->name('api.admin.destroyPaymentMethod');
    });


    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('api.admin.fetchOrders');
        Route::get('/{id}', [OrderController::class, 'show'])->name('api.admin.showOrder');
        Route::get('/{id}/products', [OrderController::class, 'getOrderProducts'])->name('api.admin.getOrderProducts');
        Route::put('/{orderId}/status', [OrderController::class, 'updateStatus'])->name('api.admin.updateOrderStatus');
        Route::delete('/{id}', [OrderController::class, 'destroy'])->name('api.admin.deleteOrder');
    });



     // Chart Routes
    

        Route::get('/charts/total-supplier', [SupplierController::class, 'getTotalSuppliers']);
          Route::get('/charts/get-courier-per-branch', [CourierController::class, 'getCourierPerBranch'])->name('charts.GetcourierPerBranch');
          Route::get('/charts/total-role', [UserManagementController::class, 'getTotalRoles']);
    });

 


// Chart Routes
//Route::get('/charts/customer-per-address', [ChartController::class, 'customerPerAddress'])->name('api.charts.customerPerAddress');
//Route::get('/charts/totalSupplier', [ChartController::class, 'totalSupplier'])->name('api.charts.totalSupplier');

    Route::group(['middleware' => ['auth:sanctum', 'is_customer']], function () {
        Route::get('/profile', [UserProfileController::class, 'show'])->name('api.customer.profile.show');
        Route::post('/profile', [UserProfileController::class, 'update'])->name('api.customer.profile.update');
        Route::post('/profile/deactivate', [UserProfileController::class, 'deactivate'])->name('api.customer.profile.deactivate');
        Route::delete('/profile', [UserProfileController::class, 'destroy'])->name('api.customer.profile.destroy');

        // Order routes
        Route::get('/customer/orders/history', [ApiCustomerController::class, 'history'])->name('api.customer.orders.history');
        Route::post('/customer/orders/status', [ApiCustomerController::class, 'updateOrderStatus'])->name('api.customer.orders.updateStatus');
        Route::get('/cart/count', [ShopController::class, 'cartCount']);
        Route::post('/updateCart/{id}', [ShopController::class, 'updateCart'])->name('api.customer.updateCart');  // New update route
        Route::delete('/removeFromCart/{id}', [ShopController::class, 'removeFromCart'])->name('api.customer.removeFromCart');
        Route::post('/addtoCart', [ShopController::class, 'addToCart']);
        Route::post('/checkout',[ShopController::class, 'checkout']);
        // Review routes
        Route::get('/customer/reviews/history', [ReviewController::class, 'history'])->name('api.customer.reviews.history');
        Route::get('/customer/products/with-stock', [ProductController::class, 'getProductsWithStock'])->name('api.customer.getProductsWithStock');
    });


    Route::get('/test-with-stock', [ProductController::class, 'getProductsWithStock']);
