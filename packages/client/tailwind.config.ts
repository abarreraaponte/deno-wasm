import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./node_modules/react-tailwindcss-select/dist/index.esm.js"],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ['light', 'dark'],
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;