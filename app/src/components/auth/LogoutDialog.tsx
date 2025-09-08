import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/hooks/useAuth'

import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

interface LogoutDialogProps {
	visible: boolean
	onDismiss: () => void
}

export default function LogoutDialog({
	visible,
	onDismiss
}: LogoutDialogProps) {
	const { t } = useTranslation()
	const { logout } = useAuth()

	return (
		<CustomDialog visible={visible} onDismiss={onDismiss}>
			<CustomDialog.Title>{t('auth.confirmLogout')}</CustomDialog.Title>
			<CustomDialog.Actions>
				<CustomButton
					flex
					onPress={logout}
					colorVariant="secondary"
					mode="contained"
				>
					{t('common.confirm')}
				</CustomButton>
				<CustomButton flex onPress={onDismiss} mode="contained">
					{t('common.cancel')}
				</CustomButton>
			</CustomDialog.Actions>
		</CustomDialog>
	)
}
