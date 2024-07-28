@extends('layouts.shop')

@section('body')
<div class="checkout-header">
    <div class="checkout-header-left">
        <img src="{{ asset('images/logo-placeholder.png') }}" alt="Logo" class="checkout-logo">
    </div>
    <div class="checkout-header-right">
        <h1>Checkout</h1>
    </div>
    <div class="progress-indicator">
        <div class="step active">1. Order Summary</div>
        <div class="step">2. Customer Details</div>
        <div class="step">3. Payment</div>
        <div class="step">4. Confirmation</div>
    </div>
</div>
<div class="checkout-container">
    <div class="checkout-section">
        <h2 class="section-title">Products Ordered</h2>
        <table class="checkout-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody id="cart-items">
                @foreach($mycarts as $cart)
                    <tr>
                        <td>{{ $cart->name }}</td>
                        <td>{{ $cart->price }}</td>
                        <td>{{ $cart->pivot_quantity }}</td>
                        <td>{{ $cart->price * $cart->pivot_quantity }}</td>
                    @endforeach
                </tr>
            </tbody>
        </table>
    </div>

    <div class="checkout-section">
        <h2 class="section-title">Customer Details</h2>
        <p><strong>First Name:</strong> {{ $customer->fname }}</p>
        <p><strong>Last Name:</strong> {{ $customer->lname }}</p>
        <p><strong>Contact:</strong> {{ $customer->contact }}</p>
        <p><strong>Address:</strong> {{ $customer->address }}</p>
    </div>

    <div class="checkout-section">
        <h2 class="section-title">Payment Methods</h2>
        <div class="form-group">
            <label for="payment-method">Select Payment Method</label>
            <select class="form-control" id="payment-method">
                @foreach($payments as $payment)
                    <option value="{{ $payment->id }}">{{ $payment->payment_name }}</option>
                @endforeach
            </select>
        </div>
    </div>

    <div class="checkout-section">
        <h2 class="section-title">Couriers</h2>
        <div class="form-group">
            <label for="courier">Select Courier</label>
            <select class="form-control" id="courier">
                @foreach($couriers as $courier)
                    <option value="{{ $courier->id }}">{{ $courier->courier_name }}</option>
                @endforeach
            </select>
        </div>
    </div>

    <div class="checkout-footer">
        <div class="total-amount">Total: ₱<span id="total-amount">0.00</span></div>
        <button class="btn checkout-btn" id="checkout">Checkout</button>
    </div>
</div>

<!-- Add the custom notifications container -->
<div id="custom-notifications"></div>

@endsection