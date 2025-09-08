import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import GroupedTicketCard from '../GroupedTicketCard'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

jest.mock('@/hooks/queries/eventTickets/useEventTicketUseByUser', () => ({
	useEventTicketUseByUser: () => ({ mutateAsync: jest.fn() })
}))

jest.mock('../BaseTicketCard', () => (_props: any) => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View>
			<Text>BaseTicketCard</Text>
		</View>
	)
})
jest.mock('../TicketCardDetailOverlay', () => (props: any) => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View>
			<Text>TicketCardDetailOverlay</Text>
			{props.actions}
		</View>
	)
})

const groupedTicket = {
	ids: [1, 2],
	ticket: { name: 'Standard', startAt: new Date(), endAt: new Date() },
	event: {}
} as any

describe('GroupedTicketCard', () => {
	it('renders base card and toggles detail overlay', () => {
		render(<GroupedTicketCard groupedTicket={groupedTicket} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('BaseTicketCard')).toBeTruthy()
		expect(screen.queryByText('TicketCardDetailOverlay')).toBeNull()

		fireEvent.press(screen.getByText('BaseTicketCard'))
		expect(screen.getByText('TicketCardDetailOverlay')).toBeTruthy()
	})

	it('renders actions when hasActions is true', () => {
		render(
			<GroupedTicketCard
				groupedTicket={groupedTicket}
				hasActions
				defaultIsDetailVisible
			/>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('tickets.staffConfirmation')).toBeTruthy()
	})
})
