<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class IsCustomer
{
    public function handle($request, Closure $next)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'You must be authenticated to access this page');
        }

        if (Auth::user()->role !== 'customer') {
            return redirect('/403')->with('error', 'You do not have permission to access this page');
        }

        return $next($request);
    }
}
