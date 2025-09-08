import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import ErrorFallback from '@/components/error/ErrorFallback'
import { CustomText } from '@/components/ui/display/CustomText'
import GradientBorderView from '@/components/ui/display/GradientBorderView'
import QRContents from '@/components/users/QRContents'
import { useUser } from '@/hooks/queries/useUser'
import { useCustomTheme } from '@/hooks/useCustomTheme'

export default function QRCodeScreen() {
	const { t } = useTranslation()
	const { colors } = useCustomTheme()
	const { data: user } = useUser()

	return (
		<View className="flex-1 ">
			<GradientBorderView
				borderRadius={12}
				borderWidth={1}
				colors={[colors.point[900], colors.point[100]]}
				useAngle
				angle={44}
				angleCenter={{ x: 0.5, y: 0.5 }}
				className="mt-3 mx-4 bg-grayscale-800"
			>
				<View className="items-center justify-center my-[50]">
					<CustomText variant="h1Semibold" className="text-center mb-1">
						{t('profile.qr.title', { nickname: user?.nickname })}
					</CustomText>
					<CustomText
						variant="body1RegularLarge"
						className="text-center mb-[34] text-grayscale-400"
					>
						{t('profile.qr.description')}
					</CustomText>
					<View className="w-full mx-auto px-3">
						<QueryErrorResetBoundary>
							{({ reset }) => (
								<ErrorBoundary
									FallbackComponent={ErrorFallback}
									onReset={reset}
								>
									<Suspense
										fallback={
											<View>
												<ActivityIndicator className="w-full aspect-square inset-0 bg-onBackground rounded-lg mb-[34]" />
												<CustomText
													variant="body1Medium"
													className="text-primary text-center"
												>
													{t('common.unit.seconds', { value: '-' })}
												</CustomText>
											</View>
										}
									>
										<QRContents />
									</Suspense>
								</ErrorBoundary>
							)}
						</QueryErrorResetBoundary>
					</View>
				</View>
			</GradientBorderView>
		</View>
	)
}
