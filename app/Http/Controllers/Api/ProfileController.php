<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Customer;

class ProfileController extends Controller
{
    // Method for displaying the profile page
   

    // Method for showing the profile data via API
    public function show()
    {
        $user = Auth::user();
        $customer = $user->customer;

        return response()->json([
            'user' => $user,
            'customer' => $customer
        ]);
    }

    // Method for updating the profile via API
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

    // Method for deactivating the profile via API
    public function deactivate(Request $request)
    {
        $user = Auth::user();
        $user->update(['active' => false]);

        return response()->json(['message' => 'Account deactivated successfully']);
    }

    // Method for deleting the profile via API
    public function destroy(Request $request)
    {
        $user = Auth::user();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}
