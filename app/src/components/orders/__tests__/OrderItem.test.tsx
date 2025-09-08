import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { PaymentStatusEnum } from '@/utils/schemas'

import { TestWrapper } from '../../testUtils/TestWrapper'
import OrderItem from '../OrderItem'

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: mockNavigate
	})
}))

jest.mock('@/hooks/queries/events/useEvent', () => ({
	useEvent: () => ({ data: { id: 99 } })
}))

// BottomSheet 내부 컨텍스트 의존성을 피하기 위해 커스텀 바텀시트를 단순 뷰로 모킹
jest.mock('../../tickets/RefundBottomSheet', () => (props: any) => {
	const { View, Text } = require('react-native')
	return props.isBottomSheetOpen ? (
		<View testID="refund-bottom-sheet">
			<Text>Refund Bottom Sheet</Text>
		</View>
	) : null
})

const baseOrder: any = {
	id: 1,
	createdAt: new Date('2024-01-01T00:00:00Z'),
	paidAt: new Date('2024-01-01T01:00:00Z'),
	status: PaymentStatusEnum.enum.PAID,
	orderItems: [
		{
			quantity: 1,
			amountKrw: 10000,
			cancelledAt: null,
			ticket: {
				startAt: new Date('2099-01-01T10:00:00Z').toISOString(),
				endAt: new Date('2099-01-01T00:00:00Z').toISOString(),
				event: {
					id: 99,
					name: '이벤트',
					imageUrl: 'http://example.com',
					endDate: '2099-01-02',
					endTime: '00:00:00'
				}
			}
		}
	]
}

describe('OrderItem', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('PAID 상태일 때 취소/재구매 버튼을 표시한다', () => {
		render(<OrderItem order={baseOrder} />, { wrapper: TestWrapper })
		expect(screen.getByText('orders.paymentDetail')).toBeTruthy()
		expect(screen.getByTestId('order-item-cancel-button')).toBeTruthy()
		expect(screen.getByText('orders.repurchase')).toBeTruthy()
	})

	it('CANCELLED 상태일 때 취소내역 버튼을 표시한다', () => {
		const cancelledOrder = {
			...baseOrder,
			status: PaymentStatusEnum.enum.CANCELLED,
			orderItems: [
				{
					...baseOrder.orderItems[0],
					cancelledAt: new Date('2024-01-01T02:00:00Z'),
					ticket: {
						...baseOrder.orderItems[0].ticket
					}
				}
			]
		}
		render(<OrderItem order={cancelledOrder} />, { wrapper: TestWrapper })

		expect(screen.getByText('orders.cancelDetail')).toBeTruthy()
		expect(screen.queryByTestId('order-item-cancel-button')).toBeNull()
	})

	it('이벤트가 종료되면 재구매 버튼을 표시하지 않는다', () => {
		const endedEventOrder = {
			...baseOrder,
			orderItems: [
				{
					...baseOrder.orderItems[0],
					ticket: {
						...baseOrder.orderItems[0].ticket,
						event: {
							...baseOrder.orderItems[0].ticket.event,
							endDate: '2020-01-01'
						}
					}
				}
			]
		}
		render(<OrderItem order={endedEventOrder} />, { wrapper: TestWrapper })

		expect(screen.queryByText('orders.repurchase')).toBeNull()
	})

	it('취소 버튼 클릭 시 환불 바텀시트를 연다', () => {
		render(<OrderItem order={baseOrder} />, { wrapper: TestWrapper })

		const cancelButton = screen.getByTestId('order-item-cancel-button')
		fireEvent.press(cancelButton)

		expect(screen.getByTestId('refund-bottom-sheet')).toBeTruthy()
	})

	it('버튼 클릭 시 올바른 화면으로 이동한다', () => {
		render(<OrderItem order={baseOrder} />, { wrapper: TestWrapper })

		fireEvent.press(screen.getByText('orders.paymentDetail'))
		expect(mockNavigate).toHaveBeenCalledWith('PaymentDetail', { orderId: 1 })

		fireEvent.press(screen.getByText('orders.repurchase'))
		expect(mockNavigate).toHaveBeenCalledWith('EventDetail', { eventId: 99 })
	})
})
