<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Stock extends Model
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'stocks';
    
    protected $fillable = ['product_id', 'quantity', 'supplier_id'];


    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
