<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'category' => $this->category, // Directly using the category field from the products table
            'stock' => $this->total_stock, // Using the new total_stock attribute
            'image_url' => $this->image_url // Using the image_url attribute
        ];
    }
}
