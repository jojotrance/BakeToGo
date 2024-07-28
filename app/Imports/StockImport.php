<?php

namespace App\Imports;

use App\Models\Stock;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StockImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Stock::updateOrCreate(
                ['product_id' => $row['product_id']],
                [
                    'quantity' => $row['quantity'],
                    'supplier_id' => $row['supplier_id']
                ]
            );
        }
    }
}
