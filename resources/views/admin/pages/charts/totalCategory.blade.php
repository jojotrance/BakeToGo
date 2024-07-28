@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Total Products Per Category Chart</h1>
    <canvas id="totalCategotyChart" width="400" height="200"></canvas>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ asset('js/admin/totalCategory.js') }}"></script>
@endsection
