import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import MyTickets from '../MyTickets'

jest.mock('@/hooks/queries/eventTickets/useEventTickets', () => ({
	useEventTickets: () => ({ data: [] })
}))

describe('MyTickets', () => {
	it('renders tabs and empty list', () => {
		render(<MyTickets />, { wrapper: TestWrapper })
		expect(screen.getByText('tickets.tabs.available')).toBeTruthy()
		expect(screen.getByText('tickets.tabs.used')).toBeTruthy()
		expect(screen.getByText('tickets.tabs.expiredOrCanceled')).toBeTruthy()
		expect(screen.getByText('tickets.empty')).toBeTruthy()
	})
})
