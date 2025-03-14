<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;

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

            $user = User::updateOrCreate(
                ['email' => $cognito_user->email],
                [
                    'first_name' => $cognito_user->user['given_name'] ?? $cognito_user->name,
                    'last_name' => $cognito_user->user['family_name'] ?? $cognito_user->name,
                    'email_verified_at' => $cognito_user->user['email_verified'] === 'true' ? now() : null,
                ]
            );

            Auth::login($user, true);

            return redirect()->intended('/restricted');
        } catch (\Exception $e) {
            Log::error('Cognito authentication error: '.$e->getMessage());
            abort(401, 'An error occurred while authenticating with Cognito.');
        }
    }
}
