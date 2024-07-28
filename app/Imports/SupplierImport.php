<?php

namespace App\Imports;

use App\Models\Supplier;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SupplierImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Supplier::updateOrCreate(
                ['supplier_name' => $row['supplier_name']],
                [
                    'image' => $row['image'],
                ]
            );
        }
    }
}
