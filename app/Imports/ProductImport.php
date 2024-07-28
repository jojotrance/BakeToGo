<?php

namespace App\Imports;

use App\Models\Product;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProductImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Product::updateOrCreate(
                ['name' => $row['name']],
                [
                    'description' => $row['description'],
                    'price' => $row['price'],
                    'category' => $row['category'],
                    'stock' => $row['stock'],
                    'image' => $row['image'],
                ]
            );
        }
    }
}
