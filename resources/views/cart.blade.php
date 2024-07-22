@extends('layouts.shop')
@section('body')
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
        </tr>
    </thead>
    <tbody>
        @foreach($mycarts as $cart)
            <tr>
                <td>{{ $cart->name }}</td>
                <td>{{ $cart->category }}</td>
                <td>{{ $cart->price }}</td>
                <td>{{ $cart->pivot_quantity }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
<a href="{{ route('checkoutDetails') }}" class="btn btn-primary">Proceed to Checkout</a>
</div>
@endsection