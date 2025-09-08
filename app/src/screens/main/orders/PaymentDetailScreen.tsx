import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, ScrollView, StyleSheet } from 'react-native'
import { DataTable } from 'react-native-paper'

import { CustomText } from '@/components/ui/display/CustomText'
import { useOrder } from '@/hooks/queries/orders/useOrder'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'
import { formatTimeRange } from '@/utils/formatters'

type Props = NativeStackScreenProps<MainStackParamList, 'PaymentDetail'>

export default function PaymentDetailScreen({ route }: Props) {
	const { orderId } = route.params
	const { t } = useTranslation()
	const { fonts, colors } = useCustomTheme()

	const { data: order, isPending, isError } = useOrder(orderId)

	const themeStyles = StyleSheet.create({
		text: {
			...fonts.body3RegularLarge,
			color: colors.grayscale[400]
		}
	})

	if (isPending || isError) {
		return null
	}

	return (
		<ScrollView style={styles.container}>
			<View>
				<CustomText variant="headline2Medium" className="mb-6">
					{t('tickets.payment.detail.ticketInfo')}
				</CustomText>
				<View className="gap-4">
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.detail.eventName')}
						</CustomText>
						<CustomText variant="body1Regular">
							{order.orderItems[0].ticket.event.name}
						</CustomText>
					</View>
					<View className="flex-row justify-between">
						<CustomText
							variant="body1Regular"
							numberOfLines={2}
							className="text-grayscale-400"
						>
							{t('tickets.payment.detail.viewingDateTime')}
						</CustomText>
						<CustomText
							variant="body1Regular"
							className="shrink ml-2 text-right"
						>
							{`${format(order.orderItems[0].ticket.startAt, 'yyyy.MM.dd')} | ${t(
								'tickets.entryTime',
								formatTimeRange(
									order.orderItems[0].ticket.startAt,
									order.orderItems[0].ticket.endAt
								)
							)}`}
						</CustomText>
					</View>
				</View>
			</View>
			<View className="mt-10">
				<CustomText variant="headline2Medium" className="mb-6">
					{t('tickets.payment.detail.paymentInfo')}
				</CustomText>
				<View className="gap-4">
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.detail.paymentDateTime')}
						</CustomText>
						<CustomText variant="body1Regular" className="ml-2">
							{order.paidAt ? format(order.paidAt, 'yyyy.MM.dd HH:mm') : ''}
						</CustomText>
					</View>
					<View className="flex-row justify-between">
						<CustomText variant="body1Regular" className="text-grayscale-400">
							{t('tickets.payment.detail.paymentMethod')}
						</CustomText>
						<CustomText variant="body1Regular">
							{order.paymentMethod}
						</CustomText>
					</View>
				</View>
			</View>
			<DataTable className="mt-10">
				<DataTable.Header className="px-0">
					<DataTable.Title textStyle={[themeStyles.text]}>
						{t('tickets.payment.detail.ticket')}
					</DataTable.Title>
					<DataTable.Title textStyle={[themeStyles.text, styles.textQuantity]}>
						{t('tickets.payment.detail.quantity')}
					</DataTable.Title>
					<DataTable.Title textStyle={[themeStyles.text, styles.textAmount]}>
						{t('tickets.payment.detail.price')}
					</DataTable.Title>
				</DataTable.Header>
				<DataTable.Row className="px-0">
					<DataTable.Cell textStyle={themeStyles.text}>
						{order.orderItems[0].ticket.name}
					</DataTable.Cell>
					<DataTable.Cell textStyle={[themeStyles.text, styles.textQuantity]}>
						{order.orderItems[0].quantity}
					</DataTable.Cell>
					<DataTable.Cell textStyle={[themeStyles.text, styles.textAmount]}>
						{order.orderItems[0].amountKrw.toLocaleString()}
					</DataTable.Cell>
				</DataTable.Row>
			</DataTable>
			<View className="mt-20 flex-row justify-between">
				<CustomText variant="body1Semibold" className="text-grayscale-400">
					{t('tickets.payment.detail.totalPaymentAmount', {
						quantity: order.orderItems[0].quantity
					})}
				</CustomText>
				<CustomText
					variant="headline2Medium"
					className="text-primary"
				>{`${order.amountKrw.toLocaleString()}${t('orders.currency')}`}</CustomText>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 35,
		paddingHorizontal: 16
	},
	textQuantity: {
		marginHorizontal: 'auto'
	},
	textAmount: {
		marginLeft: 'auto'
	}
})
