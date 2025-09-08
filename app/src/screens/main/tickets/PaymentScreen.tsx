// @ts-ignore
import { PaymentResponse } from '@portone/browser-sdk/v2'
import {
	Payment,
	PortOneController,
	PaymentUI
} from '@portone/react-native-sdk'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { isAxiosError } from 'axios'
import React, { createRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { getPaymentValidation } from '@/apis/orders/getPaymentValidation'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'Payment'>

export default function PaymentScreen({ route, navigation }: Props) {
	const { t } = useTranslation()
	const { event, request } = route.params
	const controller = createRef<PortOneController>()

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				if (controller.current?.canGoBack) {
					controller.current.webview?.goBack()
					return true
				}
				return false
			}
		)
		return () => backHandler.remove()
	})

	const handleError = (error: Error) => {
		console.error('결제 오류:', error)

		let errorMessage = error.message
		if ('pgMessage' in error && typeof error.pgMessage === 'string') {
			errorMessage = error.pgMessage
		}

		Toast.show({
			type: 'error',
			text1: errorMessage
		})
		navigation.goBack()
	}

	const handleComplete = async (complete: PaymentResponse) => {
		try {
			if (complete.message?.includes('[PAY_PROCESS_CANCELED]')) {
				Toast.show({
					type: 'info',
					text1: t('common.cancel')
				})
				navigation.goBack()
				return
			}

			const paymentResult = await getPaymentValidation({
				paymentId: complete.paymentId
			})

			if (paymentResult.status === 3) {
				navigation.replace('PaymentResult', {
					event,
					paymentResult
				})
				return
			}
		} catch (error) {
			console.error('결제 검증 오류:', error)

			let errorMessage = t('orders.errors.unknown')

			if (isAxiosError(error)) {
				switch (error.response?.data?.message) {
					case 'Order does not exist':
						errorMessage = t('orders.errors.orderNotFound')
						break
					case 'User id does not match':
						errorMessage = t('orders.errors.userMismatch')
						break
					case 'Order status conflicts with payment request':
						errorMessage = t('orders.errors.invalidStatus')
						break
					case 'Payment Amount does not match':
						errorMessage = t('orders.errors.amountMismatch')
						break
					case 'Payment expired':
						errorMessage = t('orders.errors.expired')
						break
					case 'Payment is not successful':
						errorMessage = t('orders.errors.failed')
						break
					case 'Portone error':
						errorMessage = t('orders.errors.systemError')
						break
				}
			} else if (error instanceof Error) {
				errorMessage = error.message
			}

			Toast.show({
				type: 'error',
				text1: errorMessage
			})
		}
	}

	return (
		<View className="flex-1">
			{'uiType' in request ? (
				<PaymentUI
					request={request}
					onError={handleError}
					onComplete={handleComplete}
				/>
			) : (
				<Payment
					request={request}
					onError={handleError}
					onComplete={handleComplete}
				/>
			)}
		</View>
	)
}
