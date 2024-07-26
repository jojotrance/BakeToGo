<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Define categories and product names
        $categories = ['Bread', 'Pastry', 'Cake', 'Cookie', 'Pie'];
        $productNames = [
            'Sourdough Bread', 'Whole Wheat Bread', 'Baguette', 'Ciabatta',
            'Croissant', 'Danish Pastry', 'Eclair', 'Cinnamon Roll',
            'Chocolate Cake', 'Cheesecake', 'Red Velvet Cake', 'Carrot Cake',
            'Chocolate Chip Cookie', 'Oatmeal Raisin Cookie', 'Macaron',
            'Apple Pie', 'Blueberry Muffin', 'Bagel', 'Focaccia',
            'Puff Pastry', 'Brioche', 'Pretzel', 'Scone', 'Doughnut'
        ];

        for ($i = 0; $i < 100; $i++) {
            // Generate a random color for the image
            $color = substr(md5(rand()), 0, 6);
            $imageUrl = "https://via.placeholder.com/640x480/{$color}/ffffff?text=Product";

            Product::create([
                'name' => $faker->randomElement($productNames) . ' ' . $faker->word(),
                'description' => $faker->sentence(10),
                'price' => $faker->randomFloat(2, 2, 50), // Price between $2 and $50
                'category' => $faker->randomElement($categories),
                'image' => $imageUrl
            ]);
        }
    }
}
