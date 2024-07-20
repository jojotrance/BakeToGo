<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $table = 'stocks';
    
    protected $fillable = [
        'product_id',
        'quantity',
        'supplier_id',
    ];

    // A stock belongs to a single product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // A stock belongs to a single supplier
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
