<?php

namespace Tests\Feature\Auth;

use App\Enums\AuthProviders;
use App\Http\Controllers\Auth\Auth0Controller;
use App\Models\AuthenticationProvider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class Auth0Test extends TestCase
{
    use RefreshDatabase;

    public function test_redirect_method_returns_redirect_response()
    {
        // Mock the Socialite facade
        Socialite::shouldReceive('driver')
            ->once()
            ->with('auth0')
            ->andReturnSelf();

        Socialite::shouldReceive('redirect')
            ->once()
            ->andReturn(new RedirectResponse('https://auth0-domain.com/login'));

        // Call the controller method
        $controller = new Auth0Controller;
        $response = $controller->redirect();

        // Assert it's a redirect response
        expect($response)->toBeInstanceOf(RedirectResponse::class);
        expect($response->getTargetUrl())->toBe('https://auth0-domain.com/login');
    }

    public function test_callback_handles_successful_authentication()
    {
        // Create fake user data using Faker
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $email = 'test_success_'.uniqid().'@example.com';
        $userId = fake()->uuid();

        // Create a mock Socialite User
        $socialiteUser = \Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn($userId);
        $socialiteUser->id = $userId;  // Set this directly as a property
        $socialiteUser->shouldReceive('getEmail')->andReturn($email);
        $socialiteUser->email = $email;
        $socialiteUser->shouldReceive('getName')->andReturn($firstName);
        $socialiteUser->name = $firstName;  // Set name as fallback

        // Set user data according to what we see in the logs
        $socialiteUser->user = [
            'given_name' => $firstName,
            'family_name' => $lastName,
            'email_verified' => 'true',
        ];

        // Mock the Socialite facade
        Socialite::shouldReceive('driver')
            ->once()
            ->with('auth0')
            ->andReturnSelf();

        Socialite::shouldReceive('user')
            ->once()
            ->andReturn($socialiteUser);

        // Call the controller method
        $controller = new Auth0Controller;
        $response = $controller->callback();

        // Assert the response is a redirect
        expect($response)->toBeInstanceOf(RedirectResponse::class);
        expect($response->getTargetUrl())->toBe(url('/restricted'));

        // Assert the user was created in the database
        $user = User::where('email', $email)->first();
        expect($user)->not->toBeNull();
        expect($user->first_name)->toBe($firstName);
        expect($user->last_name)->toBe($lastName);
        expect($user->email_verified_at)->not->toBeNull();

        // Assert the auth provider was created
        $authProvider = AuthenticationProvider::where('provider', AuthProviders::AUTH0)
            ->where('provider_user_id', $userId)
            ->first();
        expect($authProvider)->not->toBeNull();
        expect($authProvider->user_id)->toBe($user->id);

        // Assert the user is logged in
        expect(Auth::check())->toBeTrue();
        expect(Auth::id())->toBe($user->id);
    }

    public function test_callback_handles_authentication_error()
    {
        // Mock Socialite to throw an exception
        Socialite::shouldReceive('driver')
            ->once()
            ->with('auth0')
            ->andReturnSelf();

        Socialite::shouldReceive('user')
            ->once()
            ->andThrow(new \Exception('Invalid token'));

        // Call the controller method and expect exception
        $controller = new Auth0Controller;

        // Your controller is using abort(401, ...) which throws HttpException
        expect(fn () => $controller->callback())
            ->toThrow(HttpException::class, 'An error occurred while authenticating with Auth0');

        // Assert no user is logged in
        expect(Auth::check())->toBeFalse();
    }

    public function test_callback_creates_new_user_when_user_does_not_exist()
    {
        // Generate fake data with unique values
        $email = 'test_new_user_'.uniqid().'@example.com';
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $userId = fake()->uuid();

        // Make sure this email doesn't exist in DB
        User::where('email', $email)->delete();

        // Mock Socialite user with new email
        $socialiteUser = \Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn($userId);
        $socialiteUser->id = $userId;  // Set this directly as a property
        $socialiteUser->shouldReceive('getEmail')->andReturn($email);
        $socialiteUser->email = $email;
        $socialiteUser->shouldReceive('getName')->andReturn($firstName);
        $socialiteUser->name = $firstName;  // Set name as fallback

        $socialiteUser->user = [
            'given_name' => $firstName,
            'family_name' => $lastName,
            'email_verified' => 'true',
        ];

        Socialite::shouldReceive('driver')->with('auth0')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($socialiteUser);

        // Call controller
        $controller = new Auth0Controller;
        $controller->callback();

        // Assert new user created
        $user = User::where('email', $email)->first();
        expect($user)->not->toBeNull();
        expect($user->first_name)->toBe($firstName);
        expect($user->last_name)->toBe($lastName);

        // Assert auth provider was created
        $authProvider = AuthenticationProvider::where('provider', AuthProviders::AUTH0)
            ->where('provider_user_id', $userId)
            ->first();
        expect($authProvider)->not->toBeNull();
        expect($authProvider->user_id)->toBe($user->id);
    }

    public function test_callback_updates_existing_user_when_user_exists()
    {
        // Create existing user with unique email
        $email = 'test_existing_'.uniqid().'@example.com';
        $existingUser = User::create([
            'email' => $email,
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
        ]);

        // New data for update
        $newFirstName = fake()->firstName();
        $newLastName = fake()->lastName();
        $userId = fake()->uuid();

        // Mock Socialite user with existing email but new name
        $socialiteUser = \Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn($userId);
        $socialiteUser->id = $userId;  // Set this directly as a property
        $socialiteUser->shouldReceive('getEmail')->andReturn($email);
        $socialiteUser->email = $email;
        $socialiteUser->shouldReceive('getName')->andReturn($newFirstName);
        $socialiteUser->name = $newFirstName;  // Set name as fallback

        $socialiteUser->user = [
            'given_name' => $newFirstName,
            'family_name' => $newLastName,
            'email_verified' => 'true',
        ];

        Socialite::shouldReceive('driver')->with('auth0')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($socialiteUser);

        // Call controller
        $controller = new Auth0Controller;
        $controller->callback();

        // Assert user was updated
        $existingUser->refresh();
        expect($existingUser->first_name)->toBe($newFirstName);
        expect($existingUser->last_name)->toBe($newLastName);

        // Assert auth provider was created
        $authProvider = AuthenticationProvider::where('provider', AuthProviders::AUTH0)
            ->where('provider_user_id', $userId)
            ->first();
        expect($authProvider)->not->toBeNull();
        expect($authProvider->user_id)->toBe($existingUser->id);
    }

    public function test_callback_handles_missing_user_fields_in_auth0_response()
    {
        // Create fake data with unique email
        $email = 'test_missing_fields_'.uniqid().'@example.com';
        $userId = fake()->uuid();

        // Mock Socialite user with only email_verified
        $socialiteUser = \Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn($userId);
        $socialiteUser->id = $userId;  // Set this directly as a property
        $socialiteUser->shouldReceive('getEmail')->andReturn($email);
        $socialiteUser->email = $email;
        // Intentionally NOT setting name property

        // Your controller accesses 'given_name' and 'family_name' directly without checking
        // So this will cause an exception when those fields are missing
        $socialiteUser->user = [
            'email_verified' => false,
            // Missing given_name and family_name
        ];

        Socialite::shouldReceive('driver')->with('auth0')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($socialiteUser);

        // Call controller and expect exception
        $controller = new Auth0Controller;

        // This should throw an exception because given_name and family_name are missing
        expect(fn () => $controller->callback())
            ->toThrow(HttpException::class, 'An error occurred while authenticating with Auth0');
    }
}
