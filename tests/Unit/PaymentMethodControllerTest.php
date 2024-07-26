<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\PaymentMethod;
use App\Models\User;

class PaymentMethodControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');
    }

    /** @test */
    public function it_can_paginate_payment_methods()
    {
        PaymentMethod::factory()->count(20)->create();

        $response = $this->json('GET', '/api/admin/payment-methods', ['length' => 10]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'payment_name',
                    'image',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertCount(10, $response->json('data'));
    }

    /** @test */
    public function it_can_search_payment_methods()
    {
        PaymentMethod::factory()->create(['payment_name' => 'Test PaymentMethod']);
        PaymentMethod::factory()->count(19)->create();

        $response = $this->json('GET', '/api/admin/payment-methods', [
            'search' => ['value' => 'Test PaymentMethod'],
            'length' => 10,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'payment_name',
                    'image',
                ],
            ],
            'recordsTotal',
            'recordsFiltered',
        ]);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Test PaymentMethod', $response->json('data')[0]['payment_name']);
    }

    /** @test */
    public function it_can_create_payment_method()
    {
        $data = [
            'payment_name' => 'New PaymentMethod',
        ];

        $response = $this->json('POST', '/api/admin/payment-methods', $data);

        if ($response->status() !== 200) {
            // Log response if the status is not 200
            \Log::error('Create Payment Method failed', ['response' => $response->json()]);
        }

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'payment_name',
                'image',
            ],
        ]);

        $this->assertDatabaseHas('payment_methods', ['payment_name' => 'New PaymentMethod']);
    }

    /** @test */
    public function it_can_view_payment_method()
    {
        $paymentMethod = PaymentMethod::factory()->create();

        $response = $this->json('GET', "/api/admin/payment-methods/{$paymentMethod->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $paymentMethod->id,
            'payment_name' => $paymentMethod->payment_name,
            'image' => $paymentMethod->image ? url('storage/' . $paymentMethod->image) : null,
        ]);
    }

    /** @test */
    public function it_can_update_payment_method()
    {
        $paymentMethod = PaymentMethod::factory()->create();
        $data = [
            'payment_name' => 'Updated PaymentMethod',
        ];

        $response = $this->json('PUT', "/api/admin/payment-methods/{$paymentMethod->id}", $data);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'payment_name',
                'image',
            ],
        ]);

        $this->assertDatabaseHas('payment_methods', ['payment_name' => 'Updated PaymentMethod']);
    }

    /** @test */
    public function it_can_delete_payment_method()
    {
        $paymentMethod = PaymentMethod::factory()->create();

        $response = $this->json('DELETE', "/api/admin/payment-methods/{$paymentMethod->id}");

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Payment Method deleted']);

        $this->assertDatabaseMissing('payment_methods', ['id' => $paymentMethod->id]);
    }
}
