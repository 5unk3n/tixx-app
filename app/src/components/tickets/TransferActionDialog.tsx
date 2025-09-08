import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

interface TransferActionDialogProps {
	isVisible: boolean
	onClose: () => void
	onConfirm: () => void | Promise<void>
	type: 'accept' | 'reject' | 'cancel'
}

export default function TransferActionDialog({
	isVisible,
	onClose,
	onConfirm,
	type
}: TransferActionDialogProps) {
	const { t } = useTranslation()
	const [isCompleted, setIsCompleted] = useState(false)

	const DIALOG_CONTENT = {
		accept: {
			title: t('common.confirms.accept'),
			confirmText: t('common.actions.accept'),
			successTitle: t('tickets.messages.transferAcceptedSuccess')
		},
		reject: {
			title: t('common.confirms.reject'),
			confirmText: t('common.actions.reject'),
			successTitle: t('tickets.messages.transferRejectedSuccess')
		},
		cancel: {
			title: t('common.confirms.cancelShare'),
			confirmText: t('common.actions.cancel'),
			successTitle: t('tickets.messages.shareCanceled')
		}
	}

	const { title, confirmText, successTitle } = DIALOG_CONTENT[type]

	const handleConfirm = async () => {
		try {
			await onConfirm()
			setIsCompleted(true)
		} catch (error) {
			console.error('TransferActionDialog action failed', error)
			handleClose()
		}
	}

	const handleClose = () => {
		setIsCompleted(false)
		onClose()
	}

	return (
		<CustomDialog visible={isVisible} onDismiss={handleClose}>
			{isCompleted ? (
				<>
					<CustomDialog.Title>{successTitle}</CustomDialog.Title>
					<CustomDialog.Actions>
						<CustomButton flex onPress={handleClose} mode="contained">
							{t('common.confirm')}
						</CustomButton>
					</CustomDialog.Actions>
				</>
			) : (
				<>
					<CustomDialog.Title>{title}</CustomDialog.Title>
					<CustomDialog.Actions>
						<CustomButton
							flex
							onPress={handleClose}
							colorVariant="secondary"
							mode="contained"
						>
							{t('common.actions.cancel')}
						</CustomButton>
						<CustomButton flex onPress={handleConfirm} mode="contained">
							{confirmText}
						</CustomButton>
					</CustomDialog.Actions>
				</>
			)}
		</CustomDialog>
	)
}
