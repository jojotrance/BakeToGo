<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RevertProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete all records in the products table
        DB::table('products')->delete();
        
        // Alternatively, you can truncate the table if you want to remove all records
        // DB::table('products')->truncate();
    }
}
