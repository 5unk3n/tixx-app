import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import EmptyTickets from '../EmptyTickets'

jest.mock('@/assets/illustrations/ticket.svg', () => 'Ticket')

describe('EmptyTickets', () => {
	it('renders the empty tickets message', () => {
		render(<EmptyTickets />, { wrapper: TestWrapper })
		expect(screen.getByText('tickets.empty')).toBeTruthy()
	})
})
