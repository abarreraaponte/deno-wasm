<?php

test('example', function () {
    $response = $this->get('/health');

    $response->assertStatus(200);
});
