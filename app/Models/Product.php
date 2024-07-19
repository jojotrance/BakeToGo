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
        'category',
        'stock',
        'image'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? url('storage/product_images/' . $this->image) : url('storage/product_images/default-placeholder.png');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
    
    public function totalStock()
    {
        return $this->stocks->sum('quantity');
    }
}
