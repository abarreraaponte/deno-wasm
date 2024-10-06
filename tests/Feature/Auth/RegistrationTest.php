<?php

test('new users can register', function () {
    $response = $this->post('/register', [
        'first_name' => 'Test',
		'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertNoContent();
});
