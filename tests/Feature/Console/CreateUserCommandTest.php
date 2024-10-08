<?php

test('the command creates a user', function () {
    $this->artisan('app:create-user')
        ->expectsQuestion('First Name', 'John')
        ->expectsQuestion('Last Name', 'Doe')
        ->expectsQuestion('Email', 'jdoe@kl.com')
        ->expectsQuestion('Password', 'password')
        ->expectsOutput('User created successfully')
        ->assertExitCode(0);
});
