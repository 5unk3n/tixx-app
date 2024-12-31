import React from 'react'
import { StyleSheet } from 'react-native'
import { BaseToast, ToastProps } from 'react-native-toast-message'

import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomIcon, { IconName } from '../display/CustomIcon'

interface CustomToastProps extends ToastProps {
	icon: IconName
}

export default function CustomToast({ icon, ...props }: CustomToastProps) {
	const { colors, fonts } = useCustomTheme()

	const styles = StyleSheet.create({
		base: {
			alignItems: 'center',
			width: 'auto',
			height: 'auto',
			paddingLeft: 12,
			paddingRight: 16,
			paddingVertical: 8,
			borderRadius: 24,
			borderLeftWidth: 0,
			gap: 8,
			backgroundColor: colors.grayscale[2]
		},
		container: {
			flex: 0,
			paddingHorizontal: 0,
			justifyContent: 'center',
			alignItems: 'center'
		},
		text: {
			marginBottom: 0,
			...fonts.body3Medium,
			color: colors.onPrimary
		}
	})

	return (
		<BaseToast
			{...props}
			renderLeadingIcon={() => <CustomIcon name={icon} size={20} />}
			style={styles.base}
			contentContainerStyle={styles.container}
			text1Style={styles.text}
		/>
	)
}
