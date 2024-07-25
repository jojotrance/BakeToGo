<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Customer;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('customer')->select('users.*');

        if ($request->has('search')) {
            $searchValue = $request->input('search');
            $query->where(function ($q) use ($searchValue) {
                $q->where('users.name', 'like', "%{$searchValue}%")
                    ->orWhere('users.email', 'like', "%{$searchValue}%")
                    ->orWhereHas('customer', function ($q) use ($searchValue) {
                        $q->where('fname', 'like', "%{$searchValue}%")
                            ->orWhere('lname', 'like', "%{$searchValue}%");
                    });
            });
        }

        $totalRecords = $query->count();
        $filteredRecords = $totalRecords;

        $users = $query->paginate($request->input('length'));

        return response()->json([
            'draw' => $request->input('draw'),
            'recordsTotal' => $totalRecords,
            'recordsFiltered' => $filteredRecords,
            'data' => UserResource::collection($users),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'active_status' => 'boolean',
            'profile_image' => 'nullable|image|max:2048',
            'contact' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->active_status = $request->active_status ? 1 : 0;
            $user->role = User::ROLE_GUEST; // Default role set to guest
            if ($request->hasFile('profile_image')) {
                $profileImage = $request->file('profile_image');
                $profileImagePath = $profileImage->store('profile_images', 'public');
                $user->profile_image = $profileImagePath;
            }
            $user->save();

            $customer = new Customer();
            $customer->user_id = $user->id;
            $customer->fname = $request->first_name;
            $customer->lname = $request->last_name;
            $customer->contact = $request->contact;
            $customer->address = $request->address;
            $customer->save();

            Cache::forget("user-{$user->id}");

            DB::commit();

            return new UserResource($user);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => [
                    'message' => 'An error occurred while saving the user.',
                    'details' => $e->getMessage()
                ]
            ], 500);
        }
    }

    public function show(User $user)
    {
        try {
            $user = Cache::remember("user-{$user->id}", 60, function () use ($user) {
                return new UserResource($user->load('customer'));
            });

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => [
                    'message' => 'An error occurred while fetching the user data.',
                    'details' => $e->getMessage()
                ]
            ], 500);
        }
    }

    public function update(Request $request, User $user)
    {
        \Log::info('Update User Data Request: ', $request->all());

        $validator = Validator::make($request->all(), [
            'active_status' => 'sometimes|required|in:1,0',
            'role' => 'sometimes|required|in:' . implode(',', [User::ROLE_ADMIN, User::ROLE_CUSTOMER, User::ROLE_GUEST]),
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            if ($request->has('active_status')) {
                $user->active_status = $request->active_status == 1 ? 1 : 0;
            }

            if ($request->has('role')) {
                $user->role = $request->role;
            }

            $user->save();

            Cache::forget("user-{$user->id}");

            DB::commit();

            return response()->json([
                'success' => 'User updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error updating user data: ', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => [
                    'message' => 'An error occurred while updating the user.',
                    'details' => $e->getMessage()
                ]
            ], 500);
        }
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:' . implode(',', [User::ROLE_ADMIN, User::ROLE_CUSTOMER, User::ROLE_GUEST]),
        ]);

        $user->role = $request->role;
        $user->save();

        Cache::forget("user-{$user->id}");

        return response()->json([
            'success' => 'User role updated successfully'
        ]);
    }

    public function updateActiveStatus(Request $request, User $user)
    {
        $request->validate([
            'active_status' => 'required|in:1,0',
        ]);

        $user->active_status = $request->active_status == 1 ? 1 : 0;
        $user->save();

        Cache::forget("user-{$user->id}");

        return response()->json([
            'success' => 'User active status updated successfully'
        ]);
    }

    public function destroy(User $user)
    {
        DB::beginTransaction();

        try {
            $user->delete();

            Cache::forget("user-{$user->id}");

            DB::commit();

            return response()->json([
                'success' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => [
                    'message' => 'An error occurred while deleting the user.',
                    'details' => $e->getMessage()
                ]
            ], 500);
        }
    }

    // In App/Http/Controllers/Api/UserManagementController.php

// In App/Http/Controllers/Api/UserManagementController.php

public function getTotalRoles()
{
    $roles = User::select('role', \DB::raw('count(*) as total'))
                 ->groupBy('role')
                 ->get();

    // Ensure all roles are present, even if they have zero count
    $roleCounts = [
        'admin' => 0,
        'customer' => 0,
        'guest' => 0,
    ];

    foreach ($roles as $role) {
        $roleCounts[$role->role] = $role->total;
    }

    // Convert the array to a collection to return a consistent structure
    $roleData = collect($roleCounts)->map(function ($total, $role) {
        return ['role' => $role, 'total' => $total];
    })->values();

    return response()->json($roleData);
}


}
