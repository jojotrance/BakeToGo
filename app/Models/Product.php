<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Product extends Model
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'products'; 

    protected $fillable = [
        'name',
        'description',
        'price',
        'category', // Keep this as 'category' since you do not have a Category model
        'stock',
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
    
    public function getTotalStockAttribute()
    {
        return $this->stocks->sum('quantity');
    }
}
