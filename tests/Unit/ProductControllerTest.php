<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Product;
use App\Models\Stock;
use App\Models\User;

class ProductControllerTest extends TestCase
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
    public function it_can_paginate_products()
    {
        Product::factory()->count(20)->create();

        $response = $this->json('GET', '/api/admin/products', ['length' => 10]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'category',
                    'image', // Ensure image is included
                    'stock',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertCount(10, $response->json('data'));
    }

    /** @test */
    public function it_can_search_products()
    {
        Product::factory()->create(['name' => 'Test Product']);
        Product::factory()->count(19)->create();

        $response = $this->json('GET', '/api/admin/products', [
            'search' => ['value' => 'Test Product'],
            'length' => 10,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'category',
                    'image', // Ensure image is included
                    'stock',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Test Product', $response->json('data')[0]['name']);
    }

    /** @test */
    public function it_eager_loads_stocks()
    {
        $product = Product::factory()->create();
        Stock::factory()->create(['product_id' => $product->id]);

        $response = $this->json('GET', '/api/admin/products', ['length' => 10]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'category',
                    'image', // Ensure image is included
                    'stock',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertNotEmpty($response->json('data')[0]['stock']);
    }
}
