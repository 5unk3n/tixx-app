import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import EventTicketCard from '../EventTicketCard'

jest.mock('../BaseTicketCard', () => (_props: any) => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View>
			<Text>BaseTicketCard</Text>
		</View>
	)
})
jest.mock('../TicketCardDetailOverlay', () => (_props: any) => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View>
			<Text>TicketCardDetailOverlay</Text>
		</View>
	)
})

const eventTicket = {
	ticket: {},
	event: {}
} as any

describe('EventTicketCard', () => {
	it('toggles detail view on press', () => {
		render(<EventTicketCard eventTicket={eventTicket} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('BaseTicketCard')).toBeTruthy()
		expect(screen.queryByText('TicketCardDetailOverlay')).toBeNull()

		fireEvent.press(screen.getByText('BaseTicketCard'))
		expect(screen.getByText('TicketCardDetailOverlay')).toBeTruthy()
	})
})
