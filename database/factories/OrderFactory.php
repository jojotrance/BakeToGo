<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Customer;
use App\Models\PaymentMethod;
use App\Models\Courier;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'customer_id' => Customer::factory(),
            'payment_id' => PaymentMethod::factory(),
            'courier_id' => Courier::factory(),
            'status' => $this->faker->randomElement(['pending', 'shipped', 'delivered']),
            'total' => $this->faker->numberBetween(1000, 100000),
        ];
    }
}
