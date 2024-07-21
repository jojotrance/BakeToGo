<!-- resources/views/customer/pages/dashboard.blade.php -->
@extends('layouts.app')

@section('content')
<div id="product-content">
    <div class="container">
        <!-- Product Menu -->
        <div id="product_menu"></div>
        <!-- End of Product Menu -->
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ mix('js/product-menu.js') }}"></script>
@endpush

