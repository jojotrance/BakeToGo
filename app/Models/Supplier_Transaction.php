<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier_Transaction extends Model
{
    use HasFactory;

    protected $table = 'supplier_transaction';

    protected $fillable = [
        'supplier_id',
        'product_id',
        'quantity',
        'image'
    ];
}
