@extends('layouts.shop')

@section('body')
    <div class="cart-container">
        <table class="table" id="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody id="cart-items">
                @foreach ($mycarts as $cart)
                    @php
                        $imageUrl = !empty($cart->image)
                            ? asset("storage/product_images/{$cart->image}")
                            : asset('storage/product_images/default-placeholder.png');
                    @endphp
                    <tr data-id="{{ $cart->id }}">
                        <td>
                            <div class="product-info">
                                <img src="{{ $imageUrl }}" alt="{{ $cart->name }}" class="product-image">
                                <div class="product-details">
                                    <h5>{{ $cart->name }}</h5>
                                    <p>Category: {{ $cart->category }}</p>
                                </div>
                            </div>
                        </td>
                        <td>{{ $cart->price }}</td>
                        <td>
                            <div class='quantity-container'>
                                <button class='quantity-minus btn-quantity' data-id="{{ $cart->id }}">-</button>
                                <input type='text' id="quantity-{{ $cart->id }}" class='quantity quantity-input'
                                    value="{{ $cart->pivot_quantity }}" readonly>
                                <button class='quantity-plus btn-quantity' data-id="{{ $cart->id }}">+</button>
                            </div>
                        </td>
                        <td>
                            <button class="btn-remove" data-id="{{ $cart->id }}">✖</button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="checkout-container">
        <a href="{{ route('checkoutDetails') }}" class="btn btn-primary" id="checkout-button">Proceed to Checkout</a>
    </div>
@endsection

@section('scripts')
    @include('layouts.script')
@endsection
