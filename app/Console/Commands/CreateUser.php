<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\form;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user from the CLI';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $responses = form()
            ->text(label: 'First Name', name: 'first_name', required: true, hint: 'The first name of the user', validate: ['string'])
            ->text(label: 'Last Name', name: 'last_name', required: true, hint: 'The last name of the user', validate: ['string'])
            ->text(label: 'Email', name: 'email', required: true, hint: 'The email address of the user', validate: ['email'])
            ->password(label: 'Password', name: 'password', required: true, hint: 'The password of the user', validate: ['string'])
            ->submit();

        try {
            User::create([
                'first_name' => $responses['first_name'],
                'last_name' => $responses['last_name'],
                'email' => $responses['email'],
                'password' => Hash::make($responses['password']),
            ]);

            $this->info('User created successfully');
        } catch (\Exception $e) {
            $this->error('An error occurred while creating the user');
        }
    }
}
