<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fname',
        'lname',
        'contact',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'carts', 'customer_id', 'product_id')->withPivot('quantity');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function history()
    {
        $orders = Order::where('customer_id', auth()->id())->get();
        return view('customer.history', compact('orders'));
    }

 
}
