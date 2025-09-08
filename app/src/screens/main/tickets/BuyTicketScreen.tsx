import {
	PORTONE_KAKAO_CHANNEL_KEY,
	PORTONE_KPN_CHANNEL_KEY,
	PORTONE_PAYPAL_CHANNEL_KEY,
	PORTONE_STORE_ID,
	PORTONE_TEST_KAKAO_CHANNEL_KEY,
	PORTONE_TEST_KPN_CHANNEL_KEY,
	PORTONE_TEST_PAYPAL_CHANNEL_KEY,
	PORTONE_TEST_TOSS_CHANNEL_KEY,
	PORTONE_TOSS_CHANNEL_KEY
} from '@env'
// @ts-ignore
import { LoadPaymentUIRequest, PaymentRequest } from '@portone/browser-sdk/v2'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { isAxiosError } from 'axios'
import { format, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Image,
	Linking,
	Pressable,
	ScrollView,
	StyleSheet,
	View
} from 'react-native'
import { Divider, TouchableRipple } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import Ticket from '@/assets/illustrations/ticket-rounded.svg'
import kakaopayLogo from '@/assets/images/payment_icon_yellow_small.png'
import paypalLogo from '@/assets/images/paypal-logo.png'
import tosspayLogo from '@/assets/images/toss-pay-logo.png'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import CustomCheckbox from '@/components/ui/input/CustomCheckbox'
import CustomIconButton from '@/components/ui/input/CustomIconButton'
import { useCreatePayment } from '@/hooks/queries/orders/useCreatePayment'
import { useUser } from '@/hooks/queries/useUser'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { useOrderStore } from '@/stores/orderStore'
import { MainStackParamList } from '@/types/navigation'

import PaymentMethods from '../../../components/orders/PaymentMethods'

type Props = NativeStackScreenProps<MainStackParamList, 'BuyTicket'>

export default function BuyTicketScreen({ route, navigation }: Props) {
	const event = route.params
	const { i18n, t } = useTranslation()
	const { colors } = useCustomTheme()
	const { data: user } = useUser()
	const { order, setOrder, clearOrder } = useOrderStore()
	const [isChecked, setIsChecked] = useState(false)
	const [isPayMethodOpen, setIsPayMethodOpen] = useState(false)
	const [payMethod, setPayMethod] = useState<
		'card' | 'kakao' | 'tosspay' | 'paypal'
	>('card')

	const eventDate = format(
		parseISO(`${event.startDate}T${event.startTime}Z`),
		'yyyy.MM.dd HH:mm'
	)

	const { mutateAsync: createOrder } = useCreatePayment()

	const getChannelKey = (method: typeof payMethod) => {
		switch (method) {
			case 'card':
				return __DEV__ ? PORTONE_TEST_KPN_CHANNEL_KEY : PORTONE_KPN_CHANNEL_KEY
			case 'kakao':
				return __DEV__
					? PORTONE_TEST_KAKAO_CHANNEL_KEY
					: PORTONE_KAKAO_CHANNEL_KEY
			case 'tosspay':
				return __DEV__
					? PORTONE_TEST_TOSS_CHANNEL_KEY
					: PORTONE_TOSS_CHANNEL_KEY
			case 'paypal':
				return __DEV__
					? PORTONE_TEST_PAYPAL_CHANNEL_KEY
					: PORTONE_PAYPAL_CHANNEL_KEY
		}
	}

	const getPaymentMethod = (method: typeof payMethod) => {
		switch (method) {
			case 'card':
				return 'CARD'
			case 'paypal':
				return 'PAYPAL'
			default:
				return 'EASY_PAY'
		}
	}

	const createBaseRequest = (orderId: string) => ({
		storeId: PORTONE_STORE_ID,
		channelKey: getChannelKey(payMethod),
		paymentId: orderId,
		orderName: `${event.name} 티켓 ${order!.quantity}매`,
		totalAmount: order!.ticket.price! * order!.quantity,
		customer: {
			customerId: user!.id.toString(),
			fullName: user!.name,
			email: user!.email,
			phoneNumber: user!.phone
		},
		productType: 'PRODUCT_TYPE_DIGITAL' as const,
		// FIXME: 티켓 여러 종류 구매 시 수정 필요
		products: [
			{
				id: order!.ticket.id.toString(),
				name: `${event.name} - ${order!.ticket.name}`,
				amount: order!.ticket.price!,
				quantity: order!.quantity
			}
		]
	})

	const handlePayment = async () => {
		try {
			if (!order) {
				Toast.show({
					type: 'error',
					text1: '주문 정보가 없습니다.'
				})
				return
			}

			const { id } = await createOrder([
				{
					ticketId: order.ticket.id,
					quantity: order.quantity
				}
			])

			const baseRequest = createBaseRequest(id)

			const request =
				payMethod === 'paypal'
					? ({
							...baseRequest,
							currency: 'CURRENCY_USD',
							uiType: 'PAYPAL_SPB'
						} satisfies LoadPaymentUIRequest)
					: ({
							...baseRequest,
							currency: 'CURRENCY_KRW',
							payMethod: getPaymentMethod(payMethod),
							locale: i18n.language === 'ko' ? 'KO_KR' : 'EN_US',
							bypass: {
								kpn: {
									CardSelect: i18n.language === 'ko' ? [] : ['GLOBAL']
								}
							}
						} satisfies PaymentRequest)

			navigation.navigate('Payment', { event, request })
		} catch (error) {
			console.error(error)
			if (isAxiosError(error)) {
				if (error.response?.data?.message === 'Ticket not found') {
					Toast.show({
						type: 'error',
						text1: '존재하지 않는 티켓입니다.'
					})
				} else if (error.response?.data?.message === 'Ticket is not standard') {
					Toast.show({
						type: 'error',
						text1: '구매할 수 없는 티켓입니다.'
					})
				} else if (
					error.response?.data?.message === 'This ticket is not buyable (time)'
				) {
					Toast.show({
						type: 'error',
						text1: '판매 기간이 종료된 티켓입니다.'
					})
				} else if (
					error.response?.data?.message ===
					'This ticket is not buyable (quantity)'
				) {
					Toast.show({
						type: 'error',
						text1: '남은 수량이 부족합니다.'
					})
				} else {
					Toast.show({
						type: 'error',
						text1: '결제 중 오류가 발생했습니다.'
					})
				}
			}
		}
	}

	useEffect(() => {
		return () => {
			clearOrder()
		}
	}, [clearOrder])

	return (
		<ScrollView contentContainerStyle={styles.contentContainer}>
			<View className="flex-row gap-2 px-4">
				<Image
					source={{ uri: event.imageUrl }}
					width={84}
					className={`aspect-poster`}
				/>
				<View>
					<CustomText>{event.name}</CustomText>
					<CustomText className="mt-1">{event.host.name}</CustomText>
					<CustomText className="mt-auto text-primary">{eventDate}</CustomText>
				</View>
			</View>
			<Divider className="m-4 bg-grayscale-600" />
			<View className="flex-row items-center px-4 justify-between">
				<CustomText variant="body1Regular">
					{t('tickets.ticketQuantity')}
				</CustomText>
				<View className="flex-row">
					<CustomIconButton
						name={'minus'}
						iconColor={colors.grayscale[600]}
						onPress={() => setOrder(order!.ticket, order!.quantity - 1)}
					/>
					<View className="justify-center items-center">
						<Ticket color={colors.grayscale[700]} />
						<CustomText
							variant="headline1Medium"
							className="absolute text-primary"
						>
							{order?.quantity}
						</CustomText>
					</View>
					<CustomIconButton
						name={'plus'}
						iconColor={colors.grayscale[600]}
						onPress={() => setOrder(order!.ticket, order!.quantity + 1)}
					/>
				</View>
				<CustomText variant="body3Regular">
					{`${order!.ticket.price?.toLocaleString()} ${t('orders.currency')}`}
				</CustomText>
			</View>
			<Divider className="m-4 bg-grayscale-600" />
			<View className="mt-auto pl-3 mx-4 rounded-lg bg-grayscale-0">
				{/* TODO: 결제수단 선택 방식 변경 */}
				<View className="py-4">
					<TouchableRipple onPress={() => setIsPayMethodOpen((prev) => !prev)}>
						<View className="flex-row items-center">
							<CustomText
								variant="body1Semibold"
								className="text-grayscale-900 mr-auto"
							>
								{t('tickets.payment.title')}
							</CustomText>
							{!isPayMethodOpen &&
								(payMethod === 'card' ? (
									<CustomText
										variant="body3Regular"
										className="text-grayscale-900"
									>
										{t('tickets.payment.methods.card')}
									</CustomText>
								) : (
									<Image
										source={
											payMethod === 'kakao'
												? kakaopayLogo
												: payMethod === 'tosspay'
													? tosspayLogo
													: payMethod === 'paypal'
														? paypalLogo
														: null
										}
										className={
											payMethod === 'kakao' ? 'w-11 aspect-[97/40]' : ''
										}
									/>
								))}
							<CustomIcon
								name={isPayMethodOpen ? 'chevronUp' : 'chevronDown'}
								className="mr-3"
							/>
						</View>
					</TouchableRipple>
					{isPayMethodOpen && (
						<View className="mt-4 pr-3">
							<PaymentMethods
								payMethod={payMethod}
								onSelectMethod={setPayMethod}
							/>
						</View>
					)}
				</View>
				<Divider className="mr-3 bg-grayscale-600" />
				<View className="flex-row h-[58] items-center">
					<CustomText variant="body1Regular" className="text-grayscale-900">
						{t('tickets.payment.totalAmount')}
					</CustomText>
					<CustomText
						variant="body1Regular"
						className="ml-auto mr-3 text-grayscale-900"
					>
						{`${(order!.quantity * order!.ticket.price! || 0).toLocaleString()} ${t('orders.currency')}`}
					</CustomText>
				</View>
				<Divider className="mr-3 bg-grayscale-600" />
				<View className="flex-row h-[58] w-full justify-between items-center">
					<CustomCheckbox
						checked={isChecked}
						label={t('tickets.payment.agreeToPayment')}
						onChange={() => setIsChecked((prev) => !prev)}
						iconType="square"
					/>
					<Pressable
						onPress={() =>
							Linking.openURL(
								'https://chemical-egg-b86.notion.site/TIXX-1d5af5a3ef1580cd9f26d9f4ed7a75ae'
							)
						}
					>
						<CustomText className="mx-2 text-grayscale-900 underline">
							{t('tickets.payment.details')}
						</CustomText>
					</Pressable>
				</View>
			</View>
			<CustomButton
				onPress={handlePayment}
				className="mt-4 mx-4 mb-6"
				disabled={!order || !isChecked}
			>
				{t('tickets.payment.pay')}
			</CustomButton>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1
	}
})
