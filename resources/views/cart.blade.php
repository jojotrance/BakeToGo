@extends('layouts.shop')

@section('body')
    <div class="cart-container">
        <h2 class="cart-title">Your Cart</h2>
        <table class="table" id="cart-table">
            <tbody id="cart-items">
                @foreach ($mycarts as $cart)
                    @php
                        $imageUrl = !empty($cart->image)
                            ? asset("storage/product_images/{$cart->image}")
                            : asset('storage/product_images/default-placeholder.png');
                    @endphp
                    <tr data-id="{{ $cart->id }}">
                        <td class="product-info">
                            <img src="{{ $imageUrl }}" alt="{{ $cart->name }}" class="product-image">
                            <div class="product-details">
                                <h5>{{ $cart->name }}</h5>
                                <p>Category: {{ $cart->category }}</p>
                            </div>
                        </td>
                        <td class="product-price">
                            ₱<span class="price">{{ $cart->price }}</span>
                        </td>
                        <td class="product-quantity">
                            <div class="quantity-container">
                                <button class="quantity-minus btn-quantity" data-id="{{ $cart->id }}">-</button>
                                <input type="text" id="quantity-{{ $cart->id }}" class="quantity quantity-input" value="{{ $cart->pivot_quantity ?? 1 }}" readonly>
                                <button class="quantity-plus btn-quantity" data-id="{{ $cart->id }}">+</button>
                            </div>
                        </td>
                        <td class="product-remove">
                            <button class="btn-remove" data-id="{{ $cart->id }}">✖</button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="unique-checkout-container">
        <div class="total-amount">Total: ₱<span id="total-amount">0.00</span></div>
        <a href="{{ route('checkoutDetails') }}" class="btn btn-primary" id="checkout-button">Proceed to Checkout</a>
    </div>
@endsection

@section('scripts')
    @include('layouts.script')

@endsection
