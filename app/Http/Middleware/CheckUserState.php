<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserState
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        \Log::info('CheckUserState middleware called for route: ' . $request->route()->getName());
        
        if (Auth::check()) {
            $user = Auth::user();
            
            // Skip state checking for admin users
            if (in_array($user->role, ['SL', 'Regional Admin', 'Admin', 'Super Admin'])) {
                return $next($request);
            }
            
            // Define allowed routes for each state
            $allowedRoutes = [
                'logout', // Always allow logout
                'ml.logout', // ML logout route
                'force-logout', // Force logout route
            ];
            
            // Check user state and restrict access accordingly
            switch ($user->state) {
                case 'New':
                    // New users can only access waiting page and logout
                    $allowedRoutes[] = 'user.waiting';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('New user redirected to waiting. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.waiting');
                    }
                    break;
                    
                case 'Renew':
                    // Renew users can only access upload page and logout
                    $allowedRoutes[] = 'user.upload';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Renew user redirected to upload. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.upload');
                    }
                    break;
                    
                case 'Blocked':
                    // Blocked users can only access blocked page and logout
                    $allowedRoutes[] = 'user.blocked';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Blocked user redirected to blocked. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.blocked');
                    }
                    break;
                    
                case 'Verified':
                    // Verified users can access all routes normally
                    break;
                    
                default:
                    // Unknown state, treat as new
                    $allowedRoutes[] = 'user.waiting';
                    $currentRoute = $request->route() ? $request->route()->getName() : 'unknown';
                    if (!$request->routeIs($allowedRoutes)) {
                        \Log::info('Unknown state user redirected to waiting. Route: ' . $currentRoute . ', User: ' . $user->name . ', Allowed routes: ' . implode(', ', $allowedRoutes));
                        return redirect()->route('user.waiting');
                    }
                    break;
            }
        }
        
        return $next($request);
    }
}
