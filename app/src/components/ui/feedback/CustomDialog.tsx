import React from 'react'
import { StyleSheet } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomButton from '../input/CustomButton'

interface LogoutDialogProps {
	visible: boolean
	title: string
	leftButtonText: string
	rightButtonText: string
	onLeftPress: () => void
	onRightPress: () => void
	onDismiss?: () => void
}

export default function CustomDialog({
	visible,
	title,
	leftButtonText,
	rightButtonText,
	onLeftPress,
	onRightPress,
	onDismiss
}: LogoutDialogProps) {
	const { colors, fonts } = useCustomTheme()

	return (
		<Portal>
			<Dialog
				visible={visible}
				onDismiss={onDismiss}
				dismissable={false}
				style={[styles.dialog, { backgroundColor: colors.grayscale[1] }]}
			>
				<Dialog.Title style={[fonts.headline1Medium, styles.text]}>
					{title}
				</Dialog.Title>
				<Dialog.Actions style={styles.action}>
					<CustomButton flex onPress={onLeftPress} colorVariant="secondary">
						{leftButtonText}
					</CustomButton>
					<CustomButton flex onPress={onRightPress}>
						{rightButtonText}
					</CustomButton>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	)
}

const styles = StyleSheet.create({
	dialog: {
		marginHorizontal: 20,
		padding: 12,
		borderRadius: 12
	},
	text: {
		marginTop: 42,
		marginBottom: 54,
		textAlign: 'center'
	},
	action: {
		paddingHorizontal: 0,
		paddingBottom: 0
	}
})
