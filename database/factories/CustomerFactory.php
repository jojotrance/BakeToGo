<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition()
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'fname' => $this->faker->firstName,
            'lname' => $this->faker->lastName,
            'contact' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
        ];
    }
}
