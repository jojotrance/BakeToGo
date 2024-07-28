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
<!-- resources/views/customer/pages/custo_dashboard.blade.php -->
@extends('layouts.shop')
@section('body')
    <div class="container container-fluid" id="items">
    </div>

    <div id="custom-notifications"></div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        window.dispatchEvent(new CustomEvent('search-query', { detail: '' }));
    });
</script>
<script src="{{ asset('js/shop.js') }}"></script>
@endpush
