<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login()
    {
        return view('auth.login');
    }

    public function signup()
    {   
        return view('auth.signup');
    }

    public function registerUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:3|max:12|confirmed',
            'password_confirmation' => 'required|string|min:3|max:12',
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'contact' => 'required|string|digits:11',
            'address' => 'required|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
    
        DB::beginTransaction();
    
        try {
            $profileImagePath = null;
            if ($request->hasFile('profile_image')) {
                $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
                \Log::info('Profile image uploaded to: ' . $profileImagePath);
            } else {
                \Log::info('No profile image uploaded.');
            }
    
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'profile_image' => $profileImagePath, // Save the image path here
            ]);
    
            \Log::info('User created with ID: ' . $user->id . ' and profile image: ' . $user->profile_image);
    
            $customer = Customer::create([
                'user_id' => $user->id,
                'fname' => $validated['fname'],
                'lname' => $validated['lname'],
                'contact' => $validated['contact'],
                'address' => $validated['address']
            ]);
    
            DB::commit();
    
            return response()->json(['success' => true, 'message' => 'You have successfully registered']);
    
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error during registration: ' . $e->getMessage());
    
            return response()->json(['success' => false, 'message' => 'Something went wrong, please try again', 'error' => $e->getMessage()], 500);
        }
    }
    

    public function authenticate(Request $request)
    {
        // Validate the input
        $credentials = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            // Regenerate the session to prevent fixation attacks
            $request->session()->regenerate();

            // Redirect based on user role
            $user = Auth::user();
            if ($user->is_admin) {
                return response()->json(['success' => true, 'redirect' => route('admin.index')]);
            } else {
                return response()->json(['success' => true, 'redirect' => route('customer.menu.dashboard')]);
            }
        }

        // If authentication fails, return error message
        return response()->json(['success' => false, 'message' => 'The provided credentials do not match our records.']);
    }

    public function logout()
    {
        auth()->logout();
        return redirect()->route('login')->with('success', 'Logout Success');
    }

    public function checkEmail(Request $request)
    {
        $email = $request->input('email');
        $exists = User::where('email', $email)->exists();
        return response()->json(['exists' => $exists]);
    }

    // In AuthController.php
public function getUserProfile(Request $request)
{
    $user = Auth::user();
    return response()->json([
        'name' => $user->name,
        'profilePic' => $user->profile_image ? asset('storage/' . $user->profile_image) : null,
        'role' => $user->is_admin ? 'admin' : 'customer',
    ]);
}

}
