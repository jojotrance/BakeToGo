@extends('layouts.shop')

@section('body')
<div class="container">
    <h2>Order History</h2>

    <div class="order-status-tabs">
        <div class="tab" data-status="all">All</div>
        <div class="tab" data-status="pending">Processing</div>
        <div class="tab" data-status="shipped">Shipped</div>
        <div class="tab" data-status="to_receive">To Receive</div>
        <div class="tab" data-status="completed">Completed</div>
        <div class="tab" data-status="failed">Failed</div>
        <div class="tab" data-status="canceled">Canceled</div>
    </div>
    
    <div class="order-status-sections">
        @foreach (['all', 'pending', 'shipped', 'to_receive', 'completed', 'failed', 'canceled'] as $status)
            <div class="order-section" id="order-section-{{ $status }}">
                <h3>{{ ucfirst($status) }}</h3>
                <div class="orders">
                    <p>No orders found for this status.</p> <!-- Default message -->
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/customer/order-history.js') }}"></script>
<script src="{{ asset('js/components/builds/header.js') }}"></script>
@endpush
