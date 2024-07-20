<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'profile_image' => $this->profile_image ? asset('storage/' . $this->profile_image) : null,
            'name' => $this->name,
            'fname' => $this->customer ? $this->customer->fname : null,
            'lname' => $this->customer ? $this->customer->lname : null,
            'email' => $this->email,
            'contact' => $this->customer ? $this->customer->contact : null,
            'address' => $this->customer ? $this->customer->address : null,
            'role' => $this->role,
            'active_status' => $this->active_status,
        ];;
    }
}
