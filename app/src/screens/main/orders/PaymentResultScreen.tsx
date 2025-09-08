import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { format } from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import TixxSymbol from '@/assets/illustrations/tixx-symbol.svg'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'PaymentResult'>

export default function PaymentResultScreen({ route }: Props) {
	const { t, i18n } = useTranslation()
	const navigation = useNavigation()
	const { event, paymentResult } = route.params

	return (
		<View className="flex-1 px-4 pb-2 ">
			<View className="flex-1 mx-auto items-center justify-center">
				<TixxSymbol color={'white'} width={78} height={53} />
				<CustomText variant="headline1Medium" className="mt-12">
					{t('tickets.payment.paymentCompleted')}
				</CustomText>
				<CustomText variant="body2Medium" className="mt-2 text-primary">
					{t('tickets.payment.checkTicketHistory')}
				</CustomText>
			</View>
			<View className="bg-grayscale-700 rounded-lg px-7 py-6">
				<View className="flex-row justify-between">
					<CustomText variant="body3Medium" className="text-grayscale-300">
						{t('events.detail.title')}
					</CustomText>
					<CustomText variant="body3Regular" className="text-grayscale-300">
						{event.name}
					</CustomText>
				</View>
				<View className="mt-4 flex-row justify-between">
					<CustomText variant="body3Medium" className="text-grayscale-300">
						{t('tickets.ticketInfo')}
					</CustomText>
					<CustomText variant="body3Regular" className="text-primary">
						{`${paymentResult.orderItems[0].ticket.name} ${t('tickets.ticket')}`}
					</CustomText>
				</View>
				<View className="mt-4 flex-row justify-between">
					<CustomText variant="body3Medium" className="text-grayscale-300">
						{t('tickets.ticketQuantity')}
					</CustomText>
					<CustomText variant="body3Regular" className="text-primary">
						{t('common.unit.tickets', {
							count: paymentResult.orderItems[0].quantity
						})}
					</CustomText>
				</View>
				<View className="mt-4 flex-row justify-between">
					<CustomText variant="body3Medium" className="text-grayscale-300">
						{t('tickets.payment.totalAmount')}
					</CustomText>
					<CustomText variant="body3Regular" className="text-grayscale-300">
						{`${paymentResult.amountKrw.toLocaleString()} ${t('orders.currency')}`}
					</CustomText>
				</View>
				<View className="mt-4 flex-row justify-between">
					<CustomText variant="body3Medium" className="text-grayscale-300">
						{t('tickets.payment.paymentDate')}
					</CustomText>
					<CustomText variant="body3Regular" className="text-grayscale-300">
						{format(
							paymentResult.paidAt || '',
							i18n.language === 'ko'
								? 'yyyy년 MM월 dd일 (E) HH:mm'
								: 'MMM d, yyyy, h:mm a',
							{
								locale: i18n.language === 'ko' ? ko : enUS
							}
						)}
					</CustomText>
				</View>
			</View>
			<View className="flex-row mt-6 ">
				<CustomButton
					onPress={() =>
						navigation.reset({ index: 0, routes: [{ name: 'MainTab' }] })
					}
					flex
				>
					{t('tickets.payment.goToHome')}
				</CustomButton>
				<CustomButton
					onPress={() =>
						navigation.reset({
							index: 1,
							routes: [
								{ name: 'MainTab', params: { screen: 'MyPage' } },
								{ name: 'OrderHistory' },
								{
									name: 'PaymentDetail',
									params: { orderId: paymentResult.id }
								}
							]
						})
					}
					className="ml-2"
					flex
				>
					{t('tickets.payment.viewHistory')}
				</CustomButton>
			</View>
		</View>
	)
}
