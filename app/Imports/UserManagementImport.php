<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UserManagementImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $user = User::updateOrCreate(
                ['name' => $row['name']],
                [
                    'email' => $row['email'],
                    'password' => bcrypt($row['password']),
                    'profile_image' => $row['profile_image'],
                ]
            );

            Customer::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'fname' => $row['fname'],
                    'lname' => $row['lname'],
                    'contact' => $row['contact'],
                    'address' => $row['address'],
                ]
            );
        }
    }
}
