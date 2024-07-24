<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [   'customer_id', 'status', 'payment_id', 'courier_id']; // Add other fillable fields as needed
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product', 'order_id', 'product_id')->withPivot('quantity');
    }

    public function review()
    {
        return $this->hasMany('App\Models\Review');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function courier()
    {
        return $this->belongsTo(Courier::class, 'courier_id');
    }

     // Relationship with PaymentMethod
     public function paymentMethod()
     {
         return $this->belongsTo(PaymentMethod::class, 'payment_id');
     }  
}
