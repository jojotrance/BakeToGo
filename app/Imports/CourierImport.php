<?php

namespace App\Imports;

use App\Models\Courier;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CourierImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Courier::updateOrCreate(
                ['courier_name' => $row['courier_name']],
                [
                    'branch' => $row['branch'],
                    'image' => $row['image'],
                ]
            );
        }
    }
}
