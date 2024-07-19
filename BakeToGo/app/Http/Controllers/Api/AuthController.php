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

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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
                'role' => 'customer',
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

    /**
     * Authenticate user and return response with token on success.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
   // AuthController.php
   public function authenticate(Request $request)
{
    $credentials = $request->only('name', 'password');

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        if (!$user->active_status) {
            Auth::logout();
            return response()->json(['status' => 'inactive', 'message' => 'Your account is inactive. Please contact the administrator.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'redirect' => $user->role === 'admin' ? route('admin.index') : route('customer.menu.dashboard'),
            'token' => $token,
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'The provided credentials do not match our records.',
    ], 401);
}



    /**
     * Log the user out (revoke the token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->tokens()->delete();
    
        // Invalidate the session
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    /**
     * Get the authenticated user's profile information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
   public function getUserProfile(Request $request)
{
    $user = $request->user();
    
    return response()->json([
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'profile_image' => $user->profile_image, // Add profile_image to the response
    ]);
}


    /**
     * Show the registration form.
     *
     * @return \Illuminate\View\View
     */
    public function showRegistrationForm()
    {
        return view('auth.signup');
    }

    /**
     * Check if the email already exists.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Check if the username already exists.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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
