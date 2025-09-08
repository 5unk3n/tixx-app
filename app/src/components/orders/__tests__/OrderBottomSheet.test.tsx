import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import {
	render,
	screen,
	fireEvent,
	within
} from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '@/components/testUtils/TestWrapper'
import * as orderStore from '@/stores/orderStore'
import { Event, Ticket } from '@/types'

import OrderBottomSheet from '../OrderBottomSheet'

// Mock navigation
const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: mockNavigate
	})
}))

// Mock BottomSheet
jest.mock('@/components/ui/feedback/CustomBottomSheet', () => {
	const React = require('react')
	const { View } = require('react-native')
	return React.forwardRef((props: any, ref: any) => {
		React.useImperativeHandle(ref, () => ({
			present: jest.fn(),
			dismiss: jest.fn()
		}))
		return <View testID="bottom-sheet">{props.children}</View>
	})
})

// Mock UI components
jest.mock('@/components/ui/input/CustomIconButton', () => (props: any) => {
	const { TouchableOpacity, Text } = require('react-native')
	return (
		<TouchableOpacity
			testID={`icon-button-${props.name}`}
			onPress={props.onPress}
		>
			<Text>{props.name}</Text>
		</TouchableOpacity>
	)
})

jest.mock('@/components/ui/display/CustomIcon', () => (props: any) => {
	const { View } = require('react-native')
	return (
		<View
			testID={`custom-icon-${props.name}`}
			accessibilityLabel={props.color}
		/>
	)
})

jest.mock('react-native-safe-area-context', () => ({
	...(jest.requireActual(
		'react-native-safe-area-context'
	) as typeof import('react-native-safe-area-context')),
	useSafeAreaInsets: () => ({ bottom: 34 })
}))

const mockEvent: Event = {
	id: 1,
	name: 'Test Event',
	startDate: '2099-10-10',
	startTime: '18:00:00',
	host: { name: 'Test Host' }
} as any

const mockTickets: Ticket[] = [
	{ id: 101, type: 'Standard', price: 10000 },
	{ id: 102, type: 'Early Bird', price: 8000 }
] as any

// Zustand Store Mock
const mockSetOrder = jest.fn()

const useOrderStoreSpy = jest.spyOn(orderStore, 'useOrderStore')

describe('OrderBottomSheet', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders event and ticket information correctly', () => {
		useOrderStoreSpy.mockReturnValue({
			order: { ticket: mockTickets[0], quantity: 1 },
			setOrder: mockSetOrder
		})
		render(
			<OrderBottomSheet
				event={mockEvent}
				tickets={mockTickets}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>,
			{ wrapper: TestWrapper }
		)

		expect(screen.getByText('Test Event')).toBeTruthy()
		expect(screen.getByText('10,000 orders.currency orders.pay')).toBeTruthy()
	})

	it('highlights the selected ticket visually', () => {
		useOrderStoreSpy.mockReturnValue({
			order: { ticket: mockTickets[0], quantity: 1 },
			setOrder: mockSetOrder
		})
		render(
			<OrderBottomSheet
				event={mockEvent}
				tickets={mockTickets}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>,
			{ wrapper: TestWrapper }
		)

		const selectedIcon = within(
			screen.getByTestId('ticket-item-101')
		).getByTestId('custom-icon-userCheck')
		expect(selectedIcon.props.accessibilityLabel).toBe('#FFFFFF')

		const unselectedIcon = within(
			screen.getByTestId('ticket-item-102')
		).getByTestId('custom-icon-userCheck')
		expect(unselectedIcon.props.accessibilityLabel).toBe('#000000')
	})

	it('updates quantity and total price on screen when order changes', () => {
		useOrderStoreSpy.mockReturnValue({
			order: { ticket: mockTickets[0], quantity: 1 },
			setOrder: mockSetOrder
		})
		const { rerender } = render(
			<OrderBottomSheet
				event={mockEvent}
				tickets={mockTickets}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>,
			{ wrapper: TestWrapper }
		)

		expect(screen.getByText('1')).toBeTruthy()
		expect(screen.getByText('10,000 orders.currency orders.pay')).toBeTruthy()

		// Update the mock hook to return a new value
		useOrderStoreSpy.mockReturnValue({
			order: { ticket: mockTickets[0], quantity: 3 },
			setOrder: mockSetOrder
		})

		rerender(
			<OrderBottomSheet
				event={mockEvent}
				tickets={mockTickets}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>
		)

		expect(screen.getByText('3')).toBeTruthy()
		expect(screen.getByText('30,000 orders.currency orders.pay')).toBeTruthy()
	})

	it('does not crash when changing quantity if order is null', () => {
		// Set order to null initially
		useOrderStoreSpy.mockReturnValue({
			order: null,
			setOrder: mockSetOrder
		})

		render(
			<OrderBottomSheet
				event={mockEvent}
				tickets={mockTickets}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>,
			{ wrapper: TestWrapper }
		)

		const plusButton = screen.getByTestId('icon-button-plus')
		const minusButton = screen.getByTestId('icon-button-minus')

		// The component should not crash
		expect(() => fireEvent.press(plusButton)).not.toThrow()
		expect(() => fireEvent.press(minusButton)).not.toThrow()

		// setOrder should only be called ONCE by the useEffect hook to initialize.
		// The button presses should not trigger it because of the guard clause.
		expect(mockSetOrder).toHaveBeenCalledTimes(1)
	})

	it('navigates to BuyTicket screen on order button press', () => {
		useOrderStoreSpy.mockReturnValue({
			order: { ticket: mockTickets[0], quantity: 1 },
			setOrder: mockSetOrder
		})
		render(
			<OrderBottomSheet
				event={mockEvent}
				tickets={mockTickets}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>,
			{ wrapper: TestWrapper }
		)

		fireEvent.press(screen.getByText('10,000 orders.currency orders.pay'))
		expect(mockNavigate).toHaveBeenCalledWith('BuyTicket', mockEvent)
	})
})
