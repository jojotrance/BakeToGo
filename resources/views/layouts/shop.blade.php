<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
 <link href="{{asset('css/shop.css')}}" rel="stylesheet"> 
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
 integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
 <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
 <script src="https://code.jquery.com/jquery-3.6.4.min.js"
        integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="{{ asset('css/header.css') }}">
            <link rel="stylesheet" href="{{ asset('css/shop.css') }}">
            <link rel="stylesheet" href="{{ asset('css/cart.css') }}">
            <link rel="stylesheet" href="{{ asset('css/checkout.css') }}">
            <link rel="stylesheet" href="{{ asset('css/checkout.css') }}">
            <link rel="stylesheet" href="{{ asset('css/my-reviews.css') }}">
            <link rel="stylesheet" href="{{ asset('css/order-history.css') }}">
    <title>Shop</title>
</head>
<body>
    <div id="app-root" data-hide-components="false" data-cart-url="{{ route('mycart') }}">
        <div id="header"></div>
        @yield('body')
    </div>
</body>
@include('layouts.script')
<script src="{{ asset('js/components/builds/header.js') }}" defer></script>
<script src="{{ asset('js/app.js') }}" defer></script>
<script src="{{ asset('js/admin/payment.js') }}"></script>
<script src="{{ asset('vendor/datatables/buttons.server-side.js') }}"></script>


<!--Customer js-->
<script src="{{ asset('js/customer/my-reviews.js') }}"></script>
<script src="{{ asset('js/customer/order-history.js') }}"></script>
</html>
