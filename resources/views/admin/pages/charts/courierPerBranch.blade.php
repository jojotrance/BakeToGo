@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Courier Per Branch Chart</h1>
    <canvas id="courierPerBranchChart" width="400" height="200"></canvas>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ asset('js/admin/totalCourier.js') }}"></script>
@endsection
