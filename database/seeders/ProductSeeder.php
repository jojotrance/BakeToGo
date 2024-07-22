<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        // Define an array of image paths
        $images = [
            'product_images/laravel.png',
            // Add more images if you have multiple sample images
            'product_images/1721624266.jpg'
        ];

        for ($i = 1; $i <= 100; $i++) {
            Product::create([
                'name' => 'Product ' . $i,
                'description' => $faker->sentence,
                'price' => $faker->randomFloat(2, 10, 1000),
                'category' => 'Category ' . $faker->numberBetween(1, 10),
                'stock' => $faker->numberBetween(1, 100),
                'image' => $faker->randomElement($images)
            ]);
        }
    }
}
