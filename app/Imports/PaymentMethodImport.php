<?php

namespace App\Imports;

use App\Models\PaymentMethod;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PaymentMethodImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            PaymentMethod::updateOrCreate(
                ['payment_name' => $row['payment_name']],
                [
                    'image' => $row['image']
                ]
            );
        }
    }
}
