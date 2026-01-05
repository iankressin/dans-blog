/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				body: ['EB Garamond Variable', 'serif'],
				heading: ['Noto Serif', 'serif']
			},
			colors: {
				black: '#1a1a1a',
				'dim-0': '#f5f3f0',
				'dim-1': '#faf8f5',
				white: '#1a1a1a',
				orange: '#d97757',
				yellow: '#d4a574',
				red: '#c85a5c',
				blue: '#4a90a4',
				green: '#7a9f6f',
				pink: '#b87a9a',
				olive: '#6b7d6f',
				gray: '#6b6b6b',
				aqua: '#5a9f8f'
			}
		},
		screens: {
			tablet: '640px',
			// => @media (min-width: 640px) { ... }

			laptop: '1024px',
			// => @media (min-width: 1024px) { ... }

			desktop: '1280px'
			// => @media (min-width: 1280px) { ... }
		}
	},
	plugins: []
};
