import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import TicketManagementMenu from '../TicketManagementMenu'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

jest.mock('@/hooks/queries/eventTickets/useEventTickets', () => ({
	useEventTickets: () => ({ data: [{ id: 1 }] })
}))

jest.mock('@/hooks/queries/eventTickets/useEventTicketsTransfers', () => ({
	useEventTicketsTransfers: () => ({ data: [{ id: 1 }] })
}))

describe('TicketManagementMenu', () => {
	it('renders menu items and badges', () => {
		render(<TicketManagementMenu />, { wrapper: TestWrapper })
		expect(screen.getByText('tickets.myTickets')).toBeTruthy()
		expect(screen.getByText('tickets.receivedTickets')).toBeTruthy()
		expect(screen.getByText('tickets.sentTickets')).toBeTruthy()
		expect(screen.getAllByText('1').length).toBe(2)
	})
})
