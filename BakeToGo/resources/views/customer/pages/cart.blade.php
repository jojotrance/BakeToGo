<!-- resources/views/customer/pages/cart.blade.php -->

@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Your Shopping Cart</h1>
    @if(count($cartItems) > 0)
        <ul class="cart-list">
            @foreach($cartItems as $item)
                <li class="cart-item">
                    <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}" class="cart-item-image">
                    <span class="cart-item-name">{{ $item['name'] }}</span>
                    <span class="cart-item-price">{{ $item['price'] }}</span>
                </li>
            @endforeach
        </ul>
    @else
        <p>Your cart is empty.</p>
    @endif
</div>

<!-- Include your custom CSS for styling -->
<style>
    .cart-list {
        list-style: none;
        padding: 0;
    }

    .cart-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .cart-item-image {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .cart-item-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .cart-item-price {
        margin-left: 10px;
    }
</style>
@endsection

@php
    $hideReactComponents = true;
@endphp
