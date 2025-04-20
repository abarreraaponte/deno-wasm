<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Kitledger') }}</title>

        <meta name="csrf-token" content="{{ csrf_token() }}">

		<!-- Add favicon -->
		<link rel="icon" href="/brand/icon.png" type="image/png"/>

		<!-- Inline script to detect system dark mode preference and apply it immediately -->
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        <!-- Scripts -->
        @vite(['resources/js/app.ts', 'resources/css/app.css', "resources/js/pages/{$page['component']}.vue"])
        @inertiaHead
		<script>
			window.translations = JSON.parse('{!! json_encode(__('*')) !!}');
		</script>
    </head>
    <body>
        @inertia
    </body>
</html>