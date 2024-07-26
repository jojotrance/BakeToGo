<?php

namespace Database\Factories;

use App\Models\Courier;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourierFactory extends Factory
{
    protected $model = Courier::class;

    public function definition()
    {
        return [
            'courier_name' => $this->faker->unique()->word,
            'branch' => $this->faker->word,
            'image' => 'default.png',
        ];
    }
}
