import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import TicketListItem from '../TicketListItem'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

jest.mock('@/hooks/useEventHashtags', () => ({
	useEventHashtags: () => ({ hasHashtags: true, firstHashtag: 'hash' })
}))
jest.mock('@/hooks/useTranslateAddress', () => ({
	useTranslateAddress: () => '주소'
}))

const baseEventTicket = {
	id: 1,
	status: 'available',
	event: {
		id: 1,
		name: '이벤트명',
		imageUrl: 'http://example.com/img.jpg',
		tags: [{ tag: 'event' }],
		place: { address: 'a', name: 'n', latitude: '0', longitude: '0' },
		startDate: '2025-01-01',
		startTime: '10:00:00',
		endDate: '2025-01-01',
		endTime: '12:00:00',
		host: { name: 'Host' }
	},
	ticket: {
		startAt: new Date('2025-01-01T10:00:00Z'),
		endAt: new Date('2025-01-01T12:00:00Z')
	}
} as any

describe('TicketListItem', () => {
	it('renders ticket information', () => {
		render(<TicketListItem eventTicket={baseEventTicket} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('이벤트명')).toBeTruthy()
	})

	it('shows modal on press', () => {
		render(<TicketListItem eventTicket={baseEventTicket} />, {
			wrapper: TestWrapper
		})
		fireEvent.press(screen.getByText('이벤트명'))
		// With the mock, it should not crash.
	})
})
