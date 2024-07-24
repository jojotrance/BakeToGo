<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;
    protected $table = 'payment_methods';

    protected $fillable = [
        'payment_name',
        'image',
    ];

    public function orders()
{
    return $this->hasMany(Order::class, 'payment_id');
}
}
