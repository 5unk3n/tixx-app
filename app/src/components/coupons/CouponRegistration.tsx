import { useNavigation } from '@react-navigation/native'
import { isAxiosError } from 'axios'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useIssueCoupon } from '@/hooks/queries/coupons/useIssueCoupon'
import { Ticket } from '@/screens/main/coupons/RegisterGuestCodeScreen'

import BaseTicketCard from '../tickets/BaseTicketCard'
import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

interface CouponRegistrationProps {
	code: string
	ticket: Ticket
	onPreviousStep: () => void
}

export default function CouponRegistration({
	code,
	ticket,
	onPreviousStep
}: CouponRegistrationProps) {
	const { t } = useTranslation()
	const navigation = useNavigation()
	const { mutateAsync: issueCoupon } = useIssueCoupon()
	const [dialogState, setDialogState] = useState<{
		isVisible: boolean
		type: 'success' | 'usageLimit' | 'expired' | 'alreadyRegistered'
	}>({
		isVisible: false,
		type: 'success'
	})

	const handleCouponIssue = async () => {
		try {
			await issueCoupon({ code })
			setDialogState({
				isVisible: true,
				type: 'success'
			})
		} catch (error) {
			if (isAxiosError(error) && error.status === 400) {
				if (
					error.response?.data.message ===
					'This Coupon has reached its usage limit.'
				) {
					setDialogState({
						isVisible: true,
						type: 'usageLimit'
					})
				} else if (
					error.response?.data.message === 'This coupon has expired.'
				) {
					setDialogState({
						isVisible: true,
						type: 'expired'
					})
				} else if (
					error.response?.data.message === 'This coupon has already used.'
				) {
					setDialogState({
						isVisible: true,
						type: 'alreadyRegistered'
					})
				}
			} else if (error instanceof Error) {
				Toast.show({
					type: 'error',
					text1: error.message
				})
			}
		}
	}

	const navigateToHome = () => {
		navigation.navigate('Home')
	}

	return (
		<View className="flex-1 pt-5 px-5">
			{ticket && <BaseTicketCard ticket={ticket} event={ticket.event} />}
			<View className="flex-row mt-auto">
				<CustomButton onPress={onPreviousStep} flex colorVariant="secondary">
					{t('common.actions.reenter')}
				</CustomButton>
				<CustomButton onPress={handleCouponIssue} flex className="ml-3">
					{t('common.actions.register')}
				</CustomButton>
			</View>

			<CustomDialog visible={dialogState.isVisible}>
				{dialogState.type === 'success' ? (
					<>
						<CustomDialog.Title size="md">
							{t('coupon.messages.registered')}
						</CustomDialog.Title>
						<CustomDialog.Actions>
							<CustomButton flex onPress={navigateToHome} mode="contained">
								{t('common.confirm')}
							</CustomButton>
						</CustomDialog.Actions>
					</>
				) : dialogState.type === 'usageLimit' ? (
					<>
						{/* FIXME: 메시지 수정 필요 */}
						<CustomDialog.Title size="md">
							{t('coupon.messages.usageLimit')}
						</CustomDialog.Title>
						<CustomDialog.Actions>
							<CustomButton flex onPress={navigateToHome} mode="contained">
								{t('common.confirm')}
							</CustomButton>
						</CustomDialog.Actions>
					</>
				) : dialogState.type === 'expired' ? (
					<>
						<CustomDialog.Title size="md">
							{t('coupon.messages.expired')}
						</CustomDialog.Title>
						<CustomDialog.Actions>
							<CustomButton
								flex
								colorVariant="secondary"
								onPress={navigateToHome}
								mode="contained"
							>
								{t('common.cancel')}
							</CustomButton>
							<CustomButton flex onPress={onPreviousStep} mode="contained">
								{t('common.actions.reregister')}
							</CustomButton>
						</CustomDialog.Actions>
					</>
				) : dialogState.type === 'alreadyRegistered' ? (
					<>
						<CustomDialog.Title size="md">
							{t('coupon.messages.alreadyRegistered')}
						</CustomDialog.Title>
						<CustomDialog.Actions>
							<CustomButton flex onPress={navigateToHome} mode="contained">
								{t('common.confirm')}
							</CustomButton>
						</CustomDialog.Actions>
					</>
				) : null}
			</CustomDialog>
		</View>
	)
}
