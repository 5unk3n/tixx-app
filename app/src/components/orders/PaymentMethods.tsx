import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import kakaopayLogo from '@/assets/images/payment_icon_yellow_small.png'
import tosspayLogo from '@/assets/images/paypal-logo.png'
import paypalLogo from '@/assets/images/toss-pay-logo.png'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

type PayMethod = 'card' | 'kakao' | 'tosspay' | 'paypal'

interface PaymentMethodsProps {
	payMethod: PayMethod
	onSelectMethod: (method: PayMethod) => void
}

export default function PaymentMethods({
	payMethod,
	onSelectMethod
}: PaymentMethodsProps) {
	const { colors } = useCustomTheme()
	const { t, i18n } = useTranslation()

	return (
		<View>
			<View>
				<CustomText variant="body3Medium" className="text-grayscale-900">
					{t('tickets.payment.easyPayTitle')}
				</CustomText>
				<View className="mt-4">
					<TouchableRipple onPress={() => onSelectMethod('kakao')}>
						<View className="flex-row items-center">
							<CustomIcon
								name={
									payMethod === 'kakao'
										? 'radioCheckedSecondary'
										: 'radioUncheckedSecondary'
								}
								color={colors.primary}
							/>
							<Image
								source={kakaopayLogo}
								className="ml-2 w-11 aspect-[97/40]"
							/>
							<CustomText
								variant="body3Regular"
								className="ml-2 text-grayscale-900"
							>
								{t('tickets.payment.methods.kakao')}
							</CustomText>
						</View>
					</TouchableRipple>
					<TouchableRipple onPress={() => onSelectMethod('tosspay')}>
						<View className="mt-4 flex-row items-center">
							<CustomIcon
								name={
									payMethod === 'tosspay'
										? 'radioCheckedSecondary'
										: 'radioUncheckedSecondary'
								}
								color={colors.primary}
							/>
							<Image source={tosspayLogo} className="ml-2" />
							<CustomText
								variant="body3Regular"
								className="ml-2 text-grayscale-900"
							>
								{t('tickets.payment.methods.toss')}
							</CustomText>
						</View>
					</TouchableRipple>
					{i18n.language !== 'ko' && (
						<TouchableRipple onPress={() => onSelectMethod('paypal')}>
							<View className="mt-4 flex-row items-center">
								<CustomIcon
									name={
										payMethod === 'paypal'
											? 'radioCheckedSecondary'
											: 'radioUncheckedSecondary'
									}
									color={colors.primary}
								/>
								<Image source={paypalLogo} className="ml-2" />
								<CustomText
									variant="body3Regular"
									className="ml-2 text-grayscale-900"
								>
									{t('tickets.payment.methods.paypal')}
								</CustomText>
							</View>
						</TouchableRipple>
					)}
				</View>
			</View>
			<View className="mt-4">
				<CustomText variant="body3Medium" className="text-grayscale-900">
					{t('tickets.payment.generalPayTitle')}
				</CustomText>
				<View className="mt-4">
					<TouchableRipple onPress={() => onSelectMethod('card')}>
						<View className="flex-row items-center">
							<CustomIcon
								name={
									payMethod === 'card'
										? 'radioCheckedSecondary'
										: 'radioUncheckedSecondary'
								}
								color={colors.primary}
							/>
							<CustomText
								variant="body3Regular"
								className="ml-2 text-grayscale-900"
							>
								{t('tickets.payment.methods.card')}
							</CustomText>
						</View>
					</TouchableRipple>
				</View>
			</View>
		</View>
	)
}
