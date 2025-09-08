import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '@/components/testUtils/TestWrapper'
import * as useVenues from '@/hooks/queries/hosts/useVenues'

import HotVenueList from '../HotVenueList'

// Mock dependencies
jest.mock('react-native-reanimated-carousel', () => (props: any) => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View testID="carousel">
			<Text>Carousel</Text>
			{props.data.map((item: any, index: number) => (
				<React.Fragment key={index}>
					{props.renderItem({ item })}
				</React.Fragment>
			))}
		</View>
	)
})

jest.mock('../VenueListItem', () => (props: { venue: any; type: string }) => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View testID={`venue-list-item-${props.venue.id}`}>
			<Text>VenueListItem</Text>
			<Text>Type: {props.type}</Text>
		</View>
	)
})

const mockVenuesData = {
	pages: [
		{
			items: [
				{ id: 1, name: 'Venue 1' },
				{ id: 2, name: 'Venue 2' },
				{ id: 3, name: 'Venue 3' },
				{ id: 4, name: 'Venue 4' },
				{ id: 5, name: 'Venue 5' },
				{ id: 6, name: 'Venue 6' }
			]
		}
	],
	pageParams: [undefined]
}

const useVenuesSpy = jest.spyOn(useVenues, 'useVenues')

describe('HotVenueList', () => {
	const mockFetchNextPage = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders two carousels with card-type items by default', () => {
		useVenuesSpy.mockReturnValue({
			data: mockVenuesData,
			hasNextPage: false,
			isFetchingNextPage: false,
			fetchNextPage: mockFetchNextPage
		} as any)

		render(<HotVenueList />, { wrapper: TestWrapper })

		const carousels = screen.getAllByTestId('carousel')
		expect(carousels.length).toBe(2)

		const venueItems = screen.getAllByText('VenueListItem')
		expect(venueItems.length).toBe(mockVenuesData.pages[0].items.length)

		const itemTypes = screen.getAllByText('Type: card')
		expect(itemTypes.length).toBe(mockVenuesData.pages[0].items.length)
	})

	it('renders a FlatList with list-type items when isDetailed is true', () => {
		useVenuesSpy.mockReturnValue({
			data: mockVenuesData,
			hasNextPage: false,
			isFetchingNextPage: false,
			fetchNextPage: mockFetchNextPage
		} as any)
		render(<HotVenueList isDetailed />, { wrapper: TestWrapper })

		expect(screen.queryByTestId('carousel')).toBeNull()

		const venueItems = screen.getAllByText('VenueListItem')
		expect(venueItems.length).toBe(mockVenuesData.pages[0].items.length)

		const itemTypes = screen.getAllByText('Type: list')
		expect(itemTypes.length).toBe(mockVenuesData.pages[0].items.length)
	})

	it('calls fetchNextPage on end reached when in detailed view and hasNextPage is true', () => {
		useVenuesSpy.mockReturnValue({
			data: mockVenuesData,
			hasNextPage: true,
			isFetchingNextPage: false,
			fetchNextPage: mockFetchNextPage
		} as any)
		render(<HotVenueList isDetailed />, { wrapper: TestWrapper })

		const flatList = screen.getByTestId('hot-venue-flat-list')
		fireEvent(flatList, 'onEndReached')

		expect(mockFetchNextPage).toHaveBeenCalledTimes(1)
	})

	it('does not call fetchNextPage on end reached if hasNextPage is false', () => {
		useVenuesSpy.mockReturnValue({
			data: mockVenuesData,
			hasNextPage: false,
			isFetchingNextPage: false,
			fetchNextPage: mockFetchNextPage
		} as any)
		render(<HotVenueList isDetailed />, { wrapper: TestWrapper })

		const flatList = screen.getByTestId('hot-venue-flat-list')
		fireEvent(flatList, 'onEndReached')

		expect(mockFetchNextPage).not.toHaveBeenCalled()
	})

	it('does not call fetchNextPage on end reached if isFetchingNextPage is true', () => {
		useVenuesSpy.mockReturnValue({
			data: mockVenuesData,
			hasNextPage: true,
			isFetchingNextPage: true,
			fetchNextPage: mockFetchNextPage
		} as any)
		render(<HotVenueList isDetailed />, { wrapper: TestWrapper })

		const flatList = screen.getByTestId('hot-venue-flat-list')
		fireEvent(flatList, 'onEndReached')

		expect(mockFetchNextPage).not.toHaveBeenCalled()
	})
})
