import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import BaseTicketCard from '../BaseTicketCard'

jest.mock('@react-native-community/blur', () => ({
	BlurView: (props: any) => {
		const React = require('react')
		const { View } = require('react-native')
		return <View {...props} />
	}
}))

jest.mock('react-native-linear-gradient', () => {
	const React = require('react')
	const { View } = require('react-native')
	return (props: any) => <View {...props} />
})

const ticket = {
	id: 1,
	name: 'VIP Ticket',
	type: 'VIP',
	startAt: new Date('2025-01-01T10:00:00Z'),
	endAt: new Date('2025-01-01T12:00:00Z')
} as any

const event = {
	id: 1,
	name: 'Awesome Event',
	imageUrl: 'http://example.com/event.png',
	tags: [{ id: 1, tag: 'party' }]
} as any

describe('BaseTicketCard', () => {
	it('renders ticket and event information', () => {
		render(<BaseTicketCard ticket={ticket} event={event} />, {
			wrapper: TestWrapper
		})

		expect(screen.getByText('Awesome Event')).toBeTruthy()
		expect(screen.getAllByText('VIP Ticket').length).toBeGreaterThan(0)
		expect(screen.getByText('events.tags.party')).toBeTruthy()
	})

	it('renders ticket type when name is Standard', () => {
		const standardTicket = { ...ticket, name: 'Standard', type: 'Early Bird' }
		render(<BaseTicketCard ticket={standardTicket} event={event} />, {
			wrapper: TestWrapper
		})
		expect(screen.getAllByText('Early Bird').length).toBeGreaterThan(0)
	})
})
