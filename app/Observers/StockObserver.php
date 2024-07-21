<?php

namespace App\Observers;

use App\Models\Stock;
use App\Models\Product;

class StockObserver
{
    public function created(Stock $stock)
    {
        $this->updateProductStock($stock);
    }

    public function updated(Stock $stock)
    {
        $this->updateProductStock($stock);
    }

    public function deleted(Stock $stock)
    {
        $this->updateProductStock($stock);
    }

    private function updateProductStock(Stock $stock)
    {
        $product = $stock->product;
        $totalStock = $product->stocks->sum('quantity');
        $product->update(['stock' => $totalStock]);
    }
}
