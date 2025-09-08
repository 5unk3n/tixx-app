import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { ActivityIndicator, Portal } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
	disableSecureView,
	enabled,
	enableSecureView
} from 'react-native-screenshot-prevent'

import { useUser } from '@/hooks/queries/useUser'

import QRContents from './QRContents'
import ErrorFallback from '../error/ErrorFallback'
import { CustomText } from '../ui/display/CustomText'
import CustomDialog from '../ui/feedback/CustomDialog'
import CustomIconButton from '../ui/input/CustomIconButton'

interface QRDialogProps {
	visible: boolean
	onDismiss: () => void
}

export default function QRDialog({ visible, onDismiss }: QRDialogProps) {
	const { t } = useTranslation()
	const { data: user } = useUser()
	const insets = useSafeAreaInsets()

	useEffect(() => {
		if (visible) {
			enabled(true)
			if (!__DEV__) {
				enableSecureView()
			}

			return () => {
				enabled(false)
				if (!__DEV__) {
					disableSecureView()
				}
			}
		}
	}, [visible])

	return (
		<Portal>
			<CustomDialog visible={visible} onDismiss={onDismiss} usePortal={false}>
				<CustomDialog.Title size="lg">
					{t('profile.qr.title', { nickname: user?.nickname })}
				</CustomDialog.Title>
				<CustomDialog.Content>
					<CustomText
						variant="body1RegularLarge"
						className="text-center mb-6 text-grayscale-400"
					>
						{t('profile.qr.description')}
					</CustomText>
					<View className="h-72 w-56 mx-auto mb-14">
						<QueryErrorResetBoundary>
							{({ reset }) => (
								<ErrorBoundary
									FallbackComponent={ErrorFallback}
									onReset={reset}
								>
									<Suspense
										fallback={
											<ActivityIndicator className="h-56 inset-0 bg-onBackground rounded-lg" />
										}
									>
										<QRContents />
									</Suspense>
								</ErrorBoundary>
							)}
						</QueryErrorResetBoundary>
					</View>
				</CustomDialog.Content>
			</CustomDialog>
			{visible && (
				<View
					style={{ paddingBottom: insets.bottom }}
					className={`absolute w-full bottom-0`}
				>
					<CustomIconButton
						name="close"
						onPress={onDismiss}
						className="w-[54] h-[54] mx-auto top-[3] rounded-full bg-primary"
					/>
				</View>
			)}
		</Portal>
	)
}
