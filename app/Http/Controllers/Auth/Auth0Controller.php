<?php

namespace App\Http\Controllers\Auth;

use App\Enums\AuthProviders;
use App\Http\Controllers\Controller;
use App\Models\AuthenticationProvider;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class Auth0Controller extends Controller
{
    /**
     * Redirect the user to the Auth0 authentication page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver(AuthProviders::AUTH0->value)->redirect();
    }

    /**
     * Obtain the user information from Auth0 and log the user in.
     *
     * @throws \Exception
     */
    public function callback(): RedirectResponse
    {
        try {
            $auth0_user = Socialite::driver(AuthProviders::AUTH0->value)->user();

            // Log complete user object for better debugging
            Log::debug('Auth0 user: '.json_encode($auth0_user));

            // Validate required fields
            if (empty($auth0_user->email)) {
                Log::error('Auth0 authentication error: Missing email from provider');

                return $this->handleAuthError('Email is required for authentication');
            }

            if (empty($auth0_user->id)) {
                Log::error('Auth0 authentication error: Missing ID from provider');

                return $this->handleAuthError('User ID is required for authentication');
            }

            // Extract and validate user data
            $userData = [
                'email' => $auth0_user->email,
                'first_name' => $auth0_user->user['given_name'] ?? $auth0_user->name ?? null,
                'last_name' => $auth0_user->user['family_name'] ?? $auth0_user->name ?? null,
                'email_verified_at' => isset($auth0_user->user['email_verified']) &&
                                      $auth0_user->user['email_verified'] === 'true' ? now() : null,
            ];

            // Validate required fields after extraction
            if (empty($userData['first_name']) || empty($userData['last_name'])) {
                Log::error('Auth0 authentication error: Missing name data from provider');

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
                    'provider' => AuthProviders::AUTH0->value,
                    'provider_user_id' => $auth0_user->id,
                ],
                [
                    'user_id' => $user->id,
                    'last_used_at' => now(),
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

            Log::error('Auth0 authentication error: '.$e->getMessage());
            Log::error('Exception class: '.get_class($e));
            Log::error('Stack trace: '.$e->getTraceAsString());

            return $this->handleAuthError('An error occurred while authenticating with Auth0');
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
