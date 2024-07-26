@extends('layouts.shop')

@section('body')
<div class="container">
    <h2>Order History</h2>

    <div class="order-status-tabs">
        <div class="tab active" data-status="all">All</div>
        <div class="tab" data-status="pending">Processing</div>
        <div class="tab" data-status="shipped">Shipped</div>
        <div class="tab" data-status="to_receive">To Receive</div>
        <div class="tab" data-status="completed">Completed</div>
        <div class="tab" data-status="failed">Failed</div>
        <div class="tab" data-status="canceled">Canceled</div>
    </div>
</div>

<div class="order-status-sections">
    <div class="order-section" id="order-section-all" style="display: none;">
        <div class="orders">
            <!-- All orders will be populated here -->
        </div>
    </div>
    <div class="order-section" id="order-section-pending" style="display: none;">
        <h3>Processing</h3>
        <div class="orders">
            <!-- Processing orders will be populated here -->
        </div>
    </div>
    @foreach (['shipped', 'to_receive', 'completed', 'failed', 'canceled'] as $status)
        <div class="order-section" id="order-section-{{ $status }}" style="display: none;">
            <h3>{{ ucfirst($status) }}</h3>
            <div class="orders">
                <!-- Orders for this status will be populated here -->
            </div>
        </div>
    @endforeach
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/customer/order-history.js') }}"></script>
<script src="{{ asset('js/components/builds/header.js') }}"></script>
@endpush
