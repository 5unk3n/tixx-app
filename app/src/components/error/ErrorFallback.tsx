import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { ScrollView, StyleSheet } from 'react-native'

import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'

interface ErrorFallbackProps extends FallbackProps {
	error: Error
	title?: string
	description?: string
	buttonText?: string
}

export default function ErrorFallback({
	error,
	resetErrorBoundary,
	title = '오류가 발생했습니다.',
	description = '잠시 후 다시 시도해주세요.',
	buttonText = '다시 시도'
}: ErrorFallbackProps) {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<CustomText variant="headline1Medium" className="text-center">
				{title}
			</CustomText>
			<CustomText
				variant="body1Regular"
				className="text-center mt-2 text-onSecondary"
			>
				{description}
			</CustomText>
			<CustomButton onPress={resetErrorBoundary} className="mt-6 ">
				{buttonText}
			</CustomButton>
			{__DEV__ && (
				<CustomText variant="body3Regular" className="mt-4">
					{error.stack}
				</CustomText>
			)}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		minHeight: '100%',
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center'
	}
})
