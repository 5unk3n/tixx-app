import { BlurView } from '@react-native-community/blur'
import React, { PropsWithChildren } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { CustomText } from './CustomText'

interface BlurredChipProps extends PropsWithChildren {
	blurType?: 'light' | 'dark'
	size?: 'sm' | 'md'
}

export default function BlurredChip({
	children,
	blurType = 'light',
	size = 'md'
}: BlurredChipProps) {
	return (
		<View className="rounded-lg overflow-hidden">
			<BlurView
				blurType={blurType}
				blurAmount={Platform.OS === 'android' ? 10 : 30}
				reducedTransparencyFallbackColor="white"
				style={styles.blurView}
			/>
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				colors={['#ffffff33', '#ffffff00']}
				className={`h-full w-full justify-center items-center ${size === 'sm' ? 'px-[8]' : 'py-[2] px-[10]'}`}
			>
				<CustomText
					variant={size === 'sm' ? 'caption1Medium' : 'body3Regular'}
					className={`py-1 ${size === 'sm' ? 'text-onPrimary' : 'text-primary'}`}
				>
					{children}
				</CustomText>
			</LinearGradient>
		</View>
	)
}

const styles = StyleSheet.create({
	blurView: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	}
})
