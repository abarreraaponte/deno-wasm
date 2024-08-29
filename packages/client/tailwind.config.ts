import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import daisyui from "daisyui";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./node_modules/react-tailwindcss-select/dist/index.esm.js"],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ['light', 'dark'],
	},
	plugins: [
		typography,
		forms,
		daisyui
	],
} satisfies Config;