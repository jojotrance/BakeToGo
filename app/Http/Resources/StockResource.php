<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //return parent::toArray($request);
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'supplier_id' => $this->supplier_id,
            'supplier_name' => $this->supplier ? $this->supplier->supplier_name : null, // Include supplier name
            'product_id' => $this->product_id,
            'product_name' => $this->product ? $this->product->name : null, // Include product name
        ];
    }
}
