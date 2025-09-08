import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform } from 'react-native'
import Toast from 'react-native-toast-message'

import { useVerifyCoupon } from '@/hooks/queries/coupons/useVerifyCoupon copy'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { Ticket } from '@/screens/main/coupons/RegisterGuestCodeScreen'
import { CouponPayload } from '@/types'
import { CouponPayloadSchema } from '@/utils/schemas'

import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'
import CustomTextInput from '../ui/input/CustomTextInput'

interface CouponVerificationProps {
	onVerifyCoupon: (data: { code: string; ticket: Ticket | null }) => void
}

export default function CouponVerification({
	onVerifyCoupon
}: CouponVerificationProps) {
	const { t } = useTranslation()
	const { colors } = useCustomTheme()
	const { mutateAsync: verifyCoupon } = useVerifyCoupon()
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		setError
	} = useForm<CouponPayload>({
		resolver: zodResolver(CouponPayloadSchema)
	})

	const handleCouponVerification: SubmitHandler<CouponPayload> = async ({
		code
	}) => {
		try {
			const couponInfo = await verifyCoupon({ code })
			onVerifyCoupon({ code, ticket: couponInfo.ticket })
		} catch (error) {
			if (isAxiosError(error) && error.status === 404) {
				setError('code', { message: t('coupon.errors.invalidCode') })
			} else if (error instanceof Error) {
				Toast.show({
					type: 'error',
					text1: error.message
				})
			}
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 132 : 0}
			className="flex-1 pt-12 px-5"
		>
			<CustomText variant="h1Semibold" className="text-grayscale-100">
				{t('coupon.enterCode')}
			</CustomText>
			<Controller
				control={control}
				name="code"
				render={({ field: { onChange, value } }) => (
					<CustomTextInput
						onChangeText={onChange}
						value={value}
						placeholder={t('coupon.codePlaceholder')}
						label={t('coupon.code')}
						placeholderTextColor={colors.grayscale[400]}
						errorMessage={errors.code?.message}
						className="mt-7"
					/>
				)}
			/>
			<CustomButton
				onPress={handleSubmit(handleCouponVerification)}
				disabled={!watch('code')}
				className="bottom-0 mt-auto"
			>
				{t('common.confirm')}
			</CustomButton>
		</KeyboardAvoidingView>
	)
}
