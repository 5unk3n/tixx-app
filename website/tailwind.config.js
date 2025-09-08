import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				grayscale: {
					0: '#FFFFFF',
					50: '#F6F6F6',
					100: '#ECECEC',
					200: '#D9DADA',
					300: '#C6C7C7',
					400: '#B3B5B5',
					500: '#A0A2A2',
					600: '#838484',
					700: '#5B5C5C',
					800: '#3E3F3F',
					900: '#161717'
				},
				primary: {
					100: '#FEFFF4',
					200: '#FCFDDC',
					300: '#FAFCC4',
					400: '#F6FA93',
					500: '#F2F862',
					600: '#EEF631',
					700: '#E1EA0A',
					800: '#C9D109',
					900: '#B2B908'
				},
				status: {
					error: '#FFE6EE',
					positive: '#00BF40',
					cautionary: '#FF9200',
					destructive: '#FF4242'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Pretendard', 'sans-serif']
			},
			fontWeight: {
				regular: 400,
				medium: 500,
				semibold: 600
			},
			fontSize: {
				'display-1': ['3.5rem', '1.4'],
				'display-2': ['2.5rem', '1.4'],
				'title-1': ['2.25rem', '1.4'],
				'title-2': ['1.75rem', '1.4'],
				'title-3': ['1.5rem', '1.4'],
				'heading-1': ['1.375rem', '1.4'],
				'heading-2': ['1.25rem', '1.4'],
				'headline-1': ['1.125rem', '1.4'],
				'headline-2': ['1.0625rem', '1.4'],
				'body-1': ['1rem', '1.4'],
				'body-2': ['0.9375rem', '1.4'],
				'label-1': ['0.875rem', '1.4'],
				'label-2': ['0.8125rem', '1.4'],
				'caption-1': ['0.75rem', '1.4'],
				'caption-2': ['0.6875rem', '1.4']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [tailwindcssAnimate]
}
