import React from 'react'
import { StyleSheet } from 'react-native'
import {
	Dialog,
	DialogActionsProps,
	DialogContentProps,
	DialogProps,
	DialogTitleProps,
	Portal
} from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

interface CustomDialogProps extends DialogProps {
	usePortal?: boolean
}

export default function CustomDialog({
	usePortal = true,
	...props
}: CustomDialogProps) {
	const { colors } = useCustomTheme()

	const dialogElement = (
		<Dialog
			{...props}
			style={[styles.dialog, { backgroundColor: colors.grayscale[800] }]}
		/>
	)

	return usePortal ? <Portal>{dialogElement}</Portal> : dialogElement
}

interface CustomDialogTitleProps extends DialogTitleProps {
	size?: 'lg' | 'md'
}

function CustomDialogTitle({
	size: type = 'md',
	...props
}: CustomDialogTitleProps) {
	const { fonts, colors } = useCustomTheme()

	const titleStyles = {
		lg: [
			styles.title,
			fonts.h1Semibold,
			{ color: colors.grayscale[0], paddingTop: 24 }
		],
		md: [
			styles.title,
			fonts.headline1Medium,
			{ color: colors.grayscale[100], paddingTop: 24, lineHeight: 20 }
		]
	}

	return <Dialog.Title {...props} style={titleStyles[type]} />
}

interface CustomDialogContentProps extends DialogContentProps {}

function CustomDialogContent({ style, ...props }: CustomDialogContentProps) {
	return <Dialog.Content {...props} style={[styles.content, style]} />
}

interface CustomDialogActionsProps extends DialogActionsProps {}

function CustomDialogActions({ style, ...props }: CustomDialogActionsProps) {
	return <Dialog.Actions {...props} style={[styles.actions, style]} />
}

CustomDialog.Title = CustomDialogTitle
CustomDialog.Content = CustomDialogContent
CustomDialog.Actions = CustomDialogActions

const styles = StyleSheet.create({
	dialog: {
		marginHorizontal: 20,
		padding: 12,
		borderRadius: 12,
		minHeight: 158
	},
	title: {
		marginHorizontal: 0,
		marginTop: 0,
		marginBottom: 'auto',
		textAlign: 'center'
	},
	content: {
		marginTop: 16,
		paddingBottom: 0,
		paddingHorizontal: 0
	},
	actions: {
		flexGrow: 0,
		marginTop: 16,
		paddingHorizontal: 0,
		paddingBottom: 0
	}
})
