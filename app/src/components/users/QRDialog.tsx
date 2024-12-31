import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Platform, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Dialog, Portal } from 'react-native-paper'
import {
	disableSecureView,
	enabled,
	enableSecureView
} from 'react-native-screenshot-prevent'

import { UI } from '@/constants/ui'
import { useUser } from '@/hooks/queries/useUser'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import QRContents from './QRContents'
import ErrorFallback from '../error/ErrorFallback'
import { CustomText } from '../ui/display/CustomText'
import CustomIconButton from '../ui/input/CustomIconButton'

interface QRDialogProps {
	visible: boolean
	onDismiss: () => void
}

export default function QRDialog({ visible, onDismiss }: QRDialogProps) {
	const { fonts, colors } = useCustomTheme()
	const { data: user } = useUser()

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

	const bottomPosition = Platform.OS === 'ios' ? 'bottom-0' : 'bottom-6'

	return (
		<Portal>
			<Dialog
				visible={visible}
				onDismiss={onDismiss}
				style={[styles.container, { backgroundColor: colors.grayscale[1] }]}
			>
				<Dialog.Title
					style={[fonts.h1Semibold, styles.title]}
					className="text-center"
				>
					{`${user?.nickname}${UI.USERS.QR_MODAL_TITLE}`}
				</Dialog.Title>
				<Dialog.Content style={styles.content}>
					<CustomText
						variant="body1RegularLarge"
						className="text-center mb-6 text-grayscale-5"
					>
						{UI.USERS.QR_MODAL_DESCRIPTION}
					</CustomText>
					<View className="h-72 w-56 mx-auto">
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
				</Dialog.Content>
			</Dialog>
			{visible && (
				<View className={`absolute w-full ${bottomPosition}`}>
					<CustomIconButton
						name="close"
						onPress={onDismiss}
						className="w-16 h-16 mx-auto bottom-5 rounded-full bg-primary"
					/>
				</View>
			)}
		</Portal>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 20,
		paddingTop: 36,
		paddingBottom: 46
	},
	title: {
		marginTop: 0,
		marginBottom: 16
	},
	content: {
		paddingBottom: 0,
		paddingHorizontal: 0
	}
})
