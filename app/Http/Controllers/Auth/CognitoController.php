<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuthenticationProvider;
use App\Enums\AuthProviders;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Illuminate\Support\Facades\DB;

class CognitoController extends Controller
{
    /**
     * Redirect the user to the Cognito authentication page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('cognito')->redirect();
    }

    /**
     * Obtain the user information from Cognito and log the user in.
     *
     * @throws \Exception
     */
    public function callback(): RedirectResponse
    {
        try {
            $cognito_user = Socialite::driver('cognito')->user();
            
            // Log complete user object for better debugging
            Log::debug('Cognito user: ' . json_encode($cognito_user));
            
            // Validate required fields
            if (empty($cognito_user->email)) {
                Log::error('Cognito authentication error: Missing email from provider');
                return $this->handleAuthError('Email is required for authentication');
            }
            
            if (empty($cognito_user->id)) {
                Log::error('Cognito authentication error: Missing ID from provider');
                return $this->handleAuthError('User ID is required for authentication');
            }
            
            // Extract and validate user data
            $userData = [
                'email' => $cognito_user->email,
                'first_name' => $cognito_user->user['given_name'] ?? $cognito_user->name ?? null,
                'last_name' => $cognito_user->user['family_name'] ?? $cognito_user->name ?? null,
                'email_verified_at' => isset($cognito_user->user['email_verified']) && 
                                      $cognito_user->user['email_verified'] === 'true' ? now() : null,
            ];
            
            // Validate required fields after extraction
            if (empty($userData['first_name']) || empty($userData['last_name'])) {
                Log::error('Cognito authentication error: Missing name data from provider');
                return $this->handleAuthError('Name information is required for authentication');
            }
            
            // Begin transaction
            DB::beginTransaction();
            
            // Create or update user
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'email_verified_at' => $userData['email_verified_at'],
                ]
            );
            
            // Create or update authentication provider record
            AuthenticationProvider::updateOrCreate(
                [
                    'provider' => AuthProviders::COGNITO, 
                    'provider_user_id' => $cognito_user->id
                ],
                [
                    'user_id' => $user->id, 
                    'last_used_at' => now()
                ]
            );
            
            // Commit transaction
            DB::commit();
            
            // Log in the user
            Auth::login($user, true);
            
            return redirect()->intended('/restricted');
            
        } catch (\Exception $e) {
            // Rollback transaction if there was an error
            DB::rollBack();
            
            Log::error('Cognito authentication error: ' . $e->getMessage());
            Log::error('Exception class: ' . get_class($e));
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return $this->handleAuthError('An error occurred while authenticating with Cognito');
        }
    }
    
    /**
     * Handle authentication errors consistently
     */
    private function handleAuthError(string $message = 'Authentication failed'): RedirectResponse
    {
        // Flash message to session for UI display
        session()->flash('auth_error', $message);
        
        // Abort with 401 status
        abort(401, $message);
    }
}