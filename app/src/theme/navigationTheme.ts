import {
	DefaultTheme as reactNavigationLight,
	DarkTheme as reactNavigationDark
} from '@react-navigation/native'
import { adaptNavigationTheme } from 'react-native-paper'

import { theme } from './defaultTheme'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight,
	reactNavigationDark,
	materialLight: theme.light,
	materialDark: theme.dark
})

const navigationLightTheme = {
	...LightTheme,
	colors: {
		...LightTheme.colors,
		card: LightTheme.colors.background
	}
}

const navigationDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		card: DarkTheme.colors.background
	}
}

export const customNavigationTheme = {
	light: navigationLightTheme,
	dark: navigationDarkTheme
}
