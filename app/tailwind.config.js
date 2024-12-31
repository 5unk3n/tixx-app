const {
	colors,
	customMd3DarkColors,
	semanticColors
} = require('./src/theme/colors')
const {
	fontFamily,
	fontSizes,
	letterSpacings,
	lineHeights
} = require('./src/theme/fonts')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				...colors,
				...customMd3DarkColors,
				...semanticColors
			},
			fontFamily: { ...fontFamily },
			fontSize: { ...fontSizes },
			letterSpacing: {
				tight: letterSpacings.tight * 16,
				normal: letterSpacings.normal * 16
			},
			lineHeight: { ...lineHeights }
		}
	},
	plugins: []
}
