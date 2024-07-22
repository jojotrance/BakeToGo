<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;

class Supplier extends Model
{
    use HasFactory, HasApiTokens, Notifiable, Searchable;
    protected $table = 'suppliers';

    protected $fillable = [
        'supplier_name',
        'image',
    ];

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
    

    public function toSearchableArray()
    {
        return [
            'supplier_name' => $this->supplier_name,
        ];
    }

}
