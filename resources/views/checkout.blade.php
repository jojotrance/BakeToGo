    @extends('layouts.shop')

    @section('body')
    <div class="header">
        <img src="{{ asset('images/logo-placeholder.png') }}" alt="Logo" class="logo">
        <h1>Checkout</h1>
    </div>

    <div class="checkout-container">
        <div class="order-details card mb-3">
            <div class="card-header">
                <h2>Products Ordered</h2>
            </div>
            <div class="card-body">
                <table class="table table-borderless rounded">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody id="cartItems">
                        @foreach($mycarts as $cart)
                            <tr class="itemDetails">
                                <td>{{ $cart->name }}</td>
                                <td>{{ $cart->price }}</td>
                                <td>{{ $cart->pivot_quantity }}</td>
                                <td>{{ $cart->price * $cart->pivot_quantity }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <div class="customer-details card mb-3">
            <div class="card-header">
                <h2>Customer Details</h2>
            </div>
            <div class="card-body">
                <p><strong>First Name:</strong> {{ $customer->fname }}</p>
                <p><strong>Last Name:</strong> {{ $customer->lname }}</p>
                <p><strong>Contact:</strong> {{ $customer->contact }}</p>
                <p><strong>Address:</strong> {{ $customer->address }}</p>
            </div>
        </div>

        <div class="payment-methods card mb-3">
            <div class="card-header">
                <h2>Payment Methods</h2>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="paymentMethod">Select Payment Method</label>
                    <select class="form-control" id="paymentMethod">
                        @foreach($payments as $payment)
                            <option value="{{ $payment->id }}">{{ $payment->payment_name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>

        <div class="couriers card mb-3">
            <div class="card-header">
                <h2>Couriers</h2>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="courier">Select Courier</label>
                    <select class="form-control" id="courier">
                        @foreach($couriers as $courier)
                            <option value="{{ $courier->id }}">{{ $courier->courier_name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>

        <div class="text-center mt-4">
            <button class="btn btn-primary btn-block" id="checkout">Checkout</button>
        </div>
    </div>
    @endsection


