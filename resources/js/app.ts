/** Import Inertia, Vue and Components */
import { createApp, h, DefineComponent } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

/** Scaffold app */
const appName = "Kitledger";

createInertiaApp({
	title: (title) => `${appName} ${title ? ':' : ''} ${title}`,
	resolve: (name) =>
		resolvePageComponent(
			`./pages/${name}.vue`,
			import.meta.glob<DefineComponent>("./pages/**/*.vue"),
		),
	setup({ el, App, props, plugin }) {
		createApp({ render: () => h(App, props) })
			.use(plugin)
			.mount(el);
	},
	progress: {
		color: "#4B5563",
	},
});
