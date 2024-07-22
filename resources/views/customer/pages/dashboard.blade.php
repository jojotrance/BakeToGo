{{-- <!-- resources/views/customer/pages/dashboard.blade.php -->
@extends('layouts.app')

@section('content')

  
        <!-- Product Menu -->
        <div id="product_menu"></div>
        <!-- End of Product Menu -->

@endsection

@push('scripts')
<script src="{{ mix('js/product-menu.js') }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Set initial query and dispatch event
        const initialQuery = '';
        window.searchQuery = initialQuery;
        window.dispatchEvent(new CustomEvent('search-query', { detail: initialQuery }));
    });
</script>
@endpush --}}

@extends('layouts.shop')
@section('body')
<li class="nav-link">
    <a href="{{ route('mycart') }}" class="nav-link-item">
        <i class='bx bx-cart icon'></i>
        <span class="text nav-text">Cart</span>
    </a>
</li>

<div class="container container-fluid" id="items">
</div>
@endsection