<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\OrgMiddleware;
use App\Http\Middleware\LocaleMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
			LocaleMiddleware::class,
			OrgMiddleware::class,
			HandleInertiaRequests::class,
		]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
