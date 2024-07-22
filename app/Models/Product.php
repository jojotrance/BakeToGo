<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;

// use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, HasApiTokens, Notifiable;
    // use Searchable;

    protected $table = 'products';

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image'
    ];

    protected $appends = ['image_url', 'total_stock'];

    public function getImageUrlAttribute()
    {
        return $this->image ? url('storage/product_images/' . $this->image) : url('storage/product_images/default-placeholder.png');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function suppliers()
    {
        return $this->hasManyThrough(Supplier::class, Stock::class, 'product_id', 'id', 'id', 'supplier_id');
    }

    public function getTotalStockAttribute()
    {
        return $this->stocks->sum('quantity');
    }

    // public function toSearchableArray()
    // {
    //     return [
    //         'name' => $this->name,
    //         'description' => $this->description,
    //         'price' => $this->price,
    //         'category' => $this->category,
    //         'stock' => $this->total_stock,
    //         'supplier_names' => $this->suppliers->pluck('supplier_name')->implode(' '), // Include supplier names in the searchable array
    //     ];
    // }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_product', 'product_id', 'order_id')->withPivot('quantity');
    }

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'carts', 'customer_id', 'product_id')->withPivot('quantity');
    }
}
