import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react-native'
import React from 'react'

import * as useEventTickets from '@/hooks/queries/eventTickets/useEventTickets'

import { TestWrapper } from '../../testUtils/TestWrapper'
import TicketCarouselSection from '../TicketCarouselSection'

jest.mock('react-native-reanimated-carousel', () => {
	const React = require('react')
	const { View, Text } = require('react-native')

	const Carousel = (props: any) => (
		<View testID="carousel">
			<Text>Carousel</Text>
			{props.data.map((item: any, index: number) =>
				props.renderItem({ item, index })
			)}
		</View>
	)

	const Pagination = {
		Basic: () => (
			<View testID="pagination">
				<Text>Pagination</Text>
			</View>
		)
	}

	return {
		__esModule: true,
		default: Carousel,
		Pagination
	}
})

jest.mock('../EmptyTickets', () => () => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View>
			<Text>EmptyTickets</Text>
		</View>
	)
})

jest.mock('../GroupedTicketCard', () => () => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View>
			<Text>GroupedTicketCard</Text>
		</View>
	)
})

const mockTickets = [
	{ id: 1, ticket: {}, event: {} },
	{ id: 2, ticket: {}, event: {} },
	{ id: 3, ticket: {}, event: {} }
] as any

describe('TicketCarouselSection', () => {
	it('renders carousel and pagination when tickets are available', () => {
		jest.spyOn(useEventTickets, 'useEventTickets').mockReturnValue({
			data: mockTickets,
			refetch: jest.fn()
		} as any)

		const { getByTestId, getAllByText } = render(<TicketCarouselSection />, {
			wrapper: TestWrapper
		})

		act(() => {
			// Trigger the onLayout event
			const layout = { nativeEvent: { layout: { width: 400, height: 800 } } }
			getByTestId('carousel-section').props.onLayout(layout)
		})

		expect(getByTestId('carousel')).toBeTruthy()
		expect(getAllByText('GroupedTicketCard').length).toBe(mockTickets.length)
		expect(getByTestId('pagination')).toBeTruthy()
	})

	it('renders empty component and pagination when there are no tickets', () => {
		jest.spyOn(useEventTickets, 'useEventTickets').mockReturnValue({
			data: [],
			refetch: jest.fn()
		} as any)

		render(<TicketCarouselSection />, { wrapper: TestWrapper })

		expect(screen.getByText('EmptyTickets')).toBeTruthy()
		expect(screen.queryByTestId('carousel')).toBeNull()
		expect(screen.getByTestId('pagination')).toBeTruthy()
	})
})
