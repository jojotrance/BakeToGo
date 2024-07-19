<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Supplier extends Model
{
    use HasFactory, HasApiTokens, Notifiable;
    protected $table = 'suppliers';

    protected $fillable = [
        'supplier_name',
        'image',
    ];

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
    
}
