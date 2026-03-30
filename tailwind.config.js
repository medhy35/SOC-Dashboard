/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				bg: {
					primary: '#0f1117',
					secondary: '#1a1d27',
					tertiary: '#22263a'
				},
				border: {
					DEFAULT: '#2a2d3a'
				},
				critique: '#ef4444',
				moyen: '#f59e0b',
				faible: '#f97316'
			}
		}
	},
	plugins: []
};
