<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Order;
use App\Models\Customer;
use App\Models\PaymentMethod;
use App\Models\Courier;
use App\Models\Product;
use App\Models\User;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a user and authenticate for the tests
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');
    }

    /** @test */
    public function it_can_paginate_orders()
    {
        Order::factory()->count(20)->create();

        $response = $this->json('GET', '/api/admin/orders', ['length' => 10]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'customer',
                    'payment_method',
                    'courier',
                    'status',
                    'total',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertCount(10, $response->json('data'));
    }

    /** @test */
    public function it_can_search_orders()
    {
        Order::factory()->create(['status' => 'Test Order']);
        Order::factory()->count(19)->create();

        $response = $this->json('GET', '/api/admin/orders', [
            'search' => ['value' => 'Test Order'],
            'length' => 10,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'customer',
                    'payment_method',
                    'courier',
                    'status',
                    'total',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Test Order', $response->json('data')[0]['status']);
    }

    /** @test */
    public function it_eager_loads_orders()
    {
        $order = Order::factory()->create();
        $order->customer()->associate(Customer::factory()->create());
        $order->paymentMethod()->associate(PaymentMethod::factory()->create());
        $order->courier()->associate(Courier::factory()->create());
        $order->save();

        $response = $this->json('GET', '/api/admin/orders', ['length' => 10]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'customer',
                    'payment_method',
                    'courier',
                    'status',
                    'total',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertNotEmpty($response->json('data')[0]['customer']);
        $this->assertNotEmpty($response->json('data')[0]['payment_method']);
        $this->assertNotEmpty($response->json('data')[0]['courier']);
    }

    /** @test */
    public function it_can_show_order()
    {
        $order = Order::factory()->create();
        $order->customer()->associate(Customer::factory()->create());
        $order->paymentMethod()->associate(PaymentMethod::factory()->create());
        $order->courier()->associate(Courier::factory()->create());
        $order->save();

        $response = $this->json('GET', "/api/admin/orders/{$order->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $order->id,
            'customer' => $order->customer->fname . ' ' . $order->customer->lname,
            'payment_method' => $order->paymentMethod->payment_name,
            'courier' => $order->courier->courier_name,
            'status' => $order->status,
            'total' => $order->total,
        ]);
    }

    /** @test */
    public function it_can_update_order_status()
    {
        $order = Order::factory()->create(['status' => 'pending']);
        $response = $this->json('PATCH', "/api/admin/orders/{$order->id}/status", [
            'status' => 'shipped',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Order status updated successfully']);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'shipped',
        ]);
    }

    /** @test */
    public function it_can_delete_order()
    {
        $order = Order::factory()->create();
        $response = $this->json('DELETE', "/api/admin/orders/{$order->id}");

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Order deleted successfully']);

        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    /** @test */
    public function it_can_get_order_products()
    {
        $order = Order::factory()->create();
        $products = Product::factory()->count(3)->create(['order_id' => $order->id]);

        $response = $this->json('GET', "/api/admin/orders/{$order->id}/products");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'price',
                'quantity',
            ],
        ]);

        $this->assertCount(3, $response->json());
    }
}
