<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Customer;

class UserProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $customer = $user->customer;

        return response()->json([
            'user' => $user,
            'customer' => $customer
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $customer = $user->customer;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $customer->update([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'contact' => $request->contact,
            'address' => $request->address,
        ]);

        return response()->json(['message' => 'Profile updated successfully']);
    }

    public function deactivate(Request $request)
    {
        $user = Auth::user();
        $user->update(['active' => false]);

        return response()->json(['message' => 'Account deactivated successfully']);
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}