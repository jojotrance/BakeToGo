<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'customer_id',
        'status',
        'payment_method',
        'courier',
    ];

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
}
