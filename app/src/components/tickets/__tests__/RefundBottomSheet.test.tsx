import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import RefundBottomSheet from '../RefundBottomSheet'

jest.mock('@/hooks/queries/orders/useCancelPayment', () => ({
	useCancelPayment: () => ({ mutateAsync: jest.fn() })
}))

jest.mock('../../ui/feedback/CustomBottomSheet', () => {
	const React = require('react')
	const { View } = require('react-native')
	return React.forwardRef((props: any, _ref: any) => <View {...props} />)
})

const order = {
	orderItems: [
		{
			quantity: 2,
			ticket: {
				startAt: new Date(),
				endAt: new Date(),
				price: 10000,
				event: {}
			},
			eventTickets: [{ id: 1 }, { id: 2 }]
		}
	]
} as any

describe('RefundBottomSheet', () => {
	it('renders correctly', () => {
		render(
			<RefundBottomSheet
				order={order}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('tickets.refund.title')).toBeTruthy()
	})
})
