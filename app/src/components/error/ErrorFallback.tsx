import * as Sentry from '@sentry/react-native'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
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
	title,
	description,
	buttonText
}: ErrorFallbackProps) {
	const { t } = useTranslation()

	if (!__DEV__) {
		Sentry.captureException(error)
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<CustomText variant="headline1Medium" className="text-center">
				{title || t('common.errors.unknownError')}
			</CustomText>
			<CustomText
				variant="body1Regular"
				className="text-center mt-2 text-onSecondary"
			>
				{description || t('common.errors.tryAgainLater')}
			</CustomText>
			<CustomButton onPress={resetErrorBoundary} className="mt-6 ">
				{buttonText || t('common.retry')}
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
