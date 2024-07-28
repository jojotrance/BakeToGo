<?php

namespace App\Imports;

use App\Models\Order;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class OrderImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Order::updateOrCreate(
                ['customer_id' => $row['customer_id']],
                [
                    'status' => $row['status'],
                    'payment_id' => $row['payment_id'],
                    'courier_id' => $row['courier_id'],
                ]
            );
        }
    }
}
