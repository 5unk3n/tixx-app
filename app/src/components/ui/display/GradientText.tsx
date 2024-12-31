import MaskedView from '@react-native-masked-view/masked-view'
import { styled } from 'nativewind'
import React from 'react'
import { ViewStyle } from 'react-native'
import LinearGradient, {
	LinearGradientProps
} from 'react-native-linear-gradient'

import { typography } from '@/theme/fonts'

import { CustomText } from './CustomText'

interface GradientTextProps extends LinearGradientProps {
	variant?: keyof typeof typography
	containerStyle?: ViewStyle
	numberOfLines?: number
	adjustsFontSizeToFit?: boolean
}

function GradientText({
	variant,
	containerStyle,
	children,
	style,
	numberOfLines,
	adjustsFontSizeToFit,
	...props
}: GradientTextProps) {
	return (
		<MaskedView
			style={containerStyle}
			maskElement={
				<CustomText
					variant={variant}
					className="bg-transparent"
					style={style}
					numberOfLines={numberOfLines}
					adjustsFontSizeToFit={adjustsFontSizeToFit}
				>
					{children}
				</CustomText>
			}
		>
			<LinearGradient {...props}>
				<CustomText
					variant={variant}
					className="opacity-0"
					style={style}
					numberOfLines={numberOfLines}
					adjustsFontSizeToFit={adjustsFontSizeToFit}
				>
					{children}
				</CustomText>
			</LinearGradient>
		</MaskedView>
	)
}

export default styled(GradientText)
