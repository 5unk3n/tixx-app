import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import TicketCardDetailOverlay from '../TicketCardDetailOverlay'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

jest.mock('../../events/EventInfo', () => () => <></>)
jest.mock('../../events/EventTags', () => () => <></>)
jest.mock('react-native-linear-gradient', () => {
	const React = require('react')
	const { View } = require('react-native')
	return (props: any) => <View {...props} />
})

const eventTicket = {
	event: { name: 'Event Name', tags: [] },
	ticket: { startAt: new Date() }
} as any

describe('TicketCardDetailOverlay', () => {
	it('renders event name and view detail button', () => {
		render(<TicketCardDetailOverlay eventTicket={eventTicket} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('Event Name')).toBeTruthy()
		expect(screen.getByText('tickets.viewDetail')).toBeTruthy()
	})
})
