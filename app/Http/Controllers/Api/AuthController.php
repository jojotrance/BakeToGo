<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Customer;
use Validator;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function registerUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:3|max:12|confirmed',
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
                'profile_image' => $profileImagePath,
                'role' => User::ROLE_GUEST,
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

            return response()->json([
                'success' => true,
                'message' => 'Signup successful. Please wait for the admin to change your role or confirm your registration.'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error during registration: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => 'Something went wrong, please try again', 'error' => $e->getMessage()], 500);
        }
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('name', 'password');
    
        // Check if the credentials are an email or a username
        $fieldType = filter_var($credentials['name'], FILTER_VALIDATE_EMAIL) ? 'email' : 'name';
        $credentials = [$fieldType => $credentials['name'], 'password' => $credentials['password']];
    
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if ($user->role === User::ROLE_GUEST) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is not yet confirmed. Please wait for the admin to confirm your registration.'
                ], 403);
            }
    
            if (!$user->active_status) {
                Auth::logout();
                return response()->json(['status' => 'inactive', 'message' => 'Your account is inactive. Please contact the administrator.'], 403);
            }
    
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'redirect' => $user->role === User::ROLE_ADMIN ? route('admin.index') : route('customer.menu.dashboard'),
                'token' => $token,
            ]);
        }
    
        return response()->json([
            'success' => false,
            'message' => 'The provided credentials do not match our records.',
        ], 401);
    }
    
    public function updateRole(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'role' => 'required|in:' . implode(',', [User::ROLE_ADMIN, User::ROLE_CUSTOMER, User::ROLE_GUEST]),
        ]);

        $user->role = $validated['role'];
        $user->save();

        return response()->json(['success' => true, 'message' => 'User role updated successfully']);
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            Log::info('User logged out', ['user_id' => $request->user()->id, 'timestamp' => now()]);

            return response()->json(['message' => 'Logged out successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Logout failed', ['error' => $e->getMessage(), 'user_id' => $request->user()->id, 'timestamp' => now()]);

            return response()->json(['message' => 'Logout failed. Please try again.'], 500);
        }
    }

    public function getUserProfile(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_image' => $user->profile_image,
        ]);
    }

    public function checkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['exists' => false, 'message' => 'Invalid email format'], 400);
        }

        $emailExists = User::where('email', $request->email)->exists();
        return response()->json(['exists' => $emailExists]);
    }

    public function checkUsername(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['exists' => false, 'message' => 'Invalid username format'], 400);
        }

        $usernameExists = User::where('name', $request->name)->exists();
        return response()->json(['exists' => $usernameExists]);
    }
}
