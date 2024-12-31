import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'

import { UI } from '@/constants/ui'
import { useAuth } from '@/hooks/useAuth'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'

interface LogoutDialogProps {
	visible: boolean
	onDismiss: () => void
}

export default function LogoutDialog({
	visible,
	onDismiss
}: LogoutDialogProps) {
	const { colors } = useCustomTheme()
	const { logout } = useAuth()

	return (
		<Portal>
			<Dialog
				visible={visible}
				onDismiss={onDismiss}
				style={[style.dialog, { backgroundColor: colors.grayscale[1] }]}
			>
				<CustomText variant="headline1Medium" style={style.text}>
					{UI.AUTH.LOGOUT_CONFIRM}
				</CustomText>
				<View className="flex-row gap-[10]">
					<CustomButton flex onPress={logout} colorVariant="secondary">
						{UI.COMMON.CONFIRM}
					</CustomButton>
					<CustomButton flex onPress={onDismiss}>
						{UI.COMMON.CANCEL}
					</CustomButton>
				</View>
			</Dialog>
		</Portal>
	)
}

const style = StyleSheet.create({
	dialog: {
		marginHorizontal: 20,
		padding: 12,
		borderRadius: 12
	},
	text: {
		marginTop: 42,
		marginBottom: 54,
		textAlign: 'center'
	}
})
