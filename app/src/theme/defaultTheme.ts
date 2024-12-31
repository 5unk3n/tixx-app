import {
	MD3LightTheme,
	MD3DarkTheme,
	MD3Theme,
	configureFonts
} from 'react-native-paper'
import { MD3Type } from 'react-native-paper/lib/typescript/types.js'

import { colors, customMd3DarkColors, semanticColors } from './colors'
import { typography } from './fonts'

export type FontType = keyof typeof typography
const typedTypography = typography as Record<FontType, MD3Type>

const fontConfig = {
	default: typedTypography.body1Medium,
	...typedTypography
}

const fonts = configureFonts({ config: fontConfig })

const lightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		...colors,
		...semanticColors
	},
	fonts: fonts
}

const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		...colors,
		...customMd3DarkColors,
		...semanticColors
	},
	fonts: fonts
}

export const theme = {
	light: lightTheme,
	dark: darkTheme
}

export type CustomTheme = MD3Theme & {
	colors: typeof colors & typeof customMd3DarkColors & typeof semanticColors
	fonts: typeof typedTypography
}
