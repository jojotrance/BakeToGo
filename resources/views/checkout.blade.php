@extends('layouts.shop')
@section('body')
<h2>Customer Details</h2>
    <div class="card mb-3">
        <div class="card-body">
            <p><strong>First Name:</strong> {{ $customer->fname }}</p>
            <p><strong>Last Name:</strong> {{ $customer->lname }}</p>
            <p><strong>Contact:</strong> {{ $customer->contact }}</p>
            <p><strong>Address:</strong> {{ $customer->address }}</p>
        </div>
    </div>
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
        </tr>
    </thead>
    <tbody>
        @foreach($mycarts as $cart)
            <tr>
                <td>{{ $cart->name }}</td>
                <td>{{ $cart->price }}</td>
                <td>{{ $cart->pivot_quantity }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<h2>Payment Methods</h2>
<div class="form-group">
    <label for="paymentMethod">Select Payment Method</label>
    <select class="form-control" id="paymentMethod" name="payment_method">
        @foreach($payments as $payment)
            <option value="{{ $payment->id }}">{{ $payment->payment_name }}</option>
        @endforeach
    </select>
</div>
<h2>Couriers</h2>
<div class="form-group">
    <label for="courier">Select Courier</label>
    <select class="form-control" id="courier" name="courier">
        @foreach($couriers as $courier)
            <option value="{{ $courier->id }}">{{ $courier->courier_name }}</option>
        @endforeach
    </select>
</div>
<button class="btn btn-primary" id="checkout">Checkout</button>
</div>
@endsection