import React from 'react'
import LinearGradient, {
	LinearGradientProps
} from 'react-native-linear-gradient'

import { opacityPercentToHex } from '@/utils/opacityPercentToHex'

type gradientType = '1' | '2' | '2-2' | '3' | 'main'

const colors = {
	'1': [
		`#FFFFFF00`,
		`#1B1A1A${opacityPercentToHex(5)}`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(20)}`,
		`#1B1A1A${opacityPercentToHex(30)}`,
		`#1B1A1A${opacityPercentToHex(40)}`,
		`#1B1A1A${opacityPercentToHex(50)}`
	],
	'2': [
		`#1B1A1A${opacityPercentToHex(40)}`,
		`#1B1A1A${opacityPercentToHex(30)}`,
		`#1B1A1A${opacityPercentToHex(20)}`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(5)}`,
		`#1B1A1A${opacityPercentToHex(5)}`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(15)}`,
		`#1B1A1A${opacityPercentToHex(25)}`,
		`#1B1A1A${opacityPercentToHex(30)}`,
		`#1B1A1A${opacityPercentToHex(40)}`,
		`#1B1A1A${opacityPercentToHex(50)}`,
		`#1B1A1A${opacityPercentToHex(60)}`
	],
	'2-2': [
		`#1B1A1A${opacityPercentToHex(40)}`,
		`#1B1A1A${opacityPercentToHex(30)}`,
		`#1B1A1A${opacityPercentToHex(20)}`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(5)}`,
		`#1B1A1A${opacityPercentToHex(5)}`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(20)}`,
		`#1B1A1A${opacityPercentToHex(30)}`,
		`#1B1A1A${opacityPercentToHex(40)}`
	],
	'3': [
		`#1B1A1A${opacityPercentToHex(40)}`,
		`#1B1A1A${opacityPercentToHex(35)}`,
		`#1B1A1A${opacityPercentToHex(25)}`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(5)}`,
		`#1B1A1A${opacityPercentToHex(5)}`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(25)}`,
		`#1B1A1A${opacityPercentToHex(35)}`,
		`#1B1A1A${opacityPercentToHex(40)}`
	],
	main: [
		`#FFFFFF00`,
		`#1B1A1A${opacityPercentToHex(10)}`,
		`#1B1A1A${opacityPercentToHex(20)}`,
		`#1B1A1A${opacityPercentToHex(30)}`,
		`#1B1A1A${opacityPercentToHex(35)}`,
		`#1B1A1A${opacityPercentToHex(50)}`,
		`#1B1A1A${opacityPercentToHex(55)}`,
		`#1B1A1A${opacityPercentToHex(60)}`
	]
} satisfies Record<gradientType, (string | number)[]>

const locations = {
	'1': [0, 0.45, 0.56, 0.67, 0.78, 0.89, 1],
	'2': [0, 0.05, 0.11, 0.17, 0.23, 0.53, 0.59, 0.65, 0.7, 0.76, 0.81, 0.91, 1],
	'2-2': [0, 0.07, 0.11, 0.17, 0.23, 0.53, 0.64, 0.76, 0.87, 1],
	'3': [0, 0.06, 0.12, 0.18, 0.23, 0.77, 0.83, 0.9, 0.95, 1],
	main: [0, 0.3, 0.44, 0.58, 0.69, 0.8, 0.9, 1]
} satisfies Record<gradientType, number[]>

interface ShadowGradientProps
	extends Omit<LinearGradientProps, 'colors' | 'locations'> {
	type: gradientType
}

export default function ShadowGradient({
	type,
	...props
}: ShadowGradientProps) {
	return (
		<LinearGradient
			{...props}
			colors={colors[type]}
			locations={locations[type]}
			className="absolute top-0 left-0 w-full h-full"
		/>
	)
}
