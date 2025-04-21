<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
		$locale = app()->getLocale();
		$type = config('app.env');
		$region = config('app.region');
		$version = config('app.version');

        return [
            ...parent::share($request),
			'name' => config('app.name'),
			'user' => $request->user() ?? null,
			'environment' => [
				'locale' => $locale ?? null,
				'region' => $region ?? null,
				'type' => $type ?? null,
				'version' => $version ?? null,
			],
            'flash' => [
				'success' => $request->session()->get('success') ?? null,
				'error' => $request->session()->get('error') ?? null,
				'warning' => $request->session()->get('warning') ?? null,
				'info' => $request->session()->get('info') ?? null,
			],
        ];
    }
}
