import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import TransferredTickets from '../TransferredTickets'

jest.mock('@/hooks/queries/eventTickets/useEventTicketsTransfers', () => ({
	useEventTicketsTransfers: () => ({ data: [{ id: 1 }], isPending: false })
}))
jest.mock('@/hooks/queries/eventTickets/useActionEventTicketTransfer', () => ({
	useActionEventTicketTransfer: () => ({ mutateAsync: jest.fn() })
}))
jest.mock('../ReceivedTicket', () => () => <></>)
jest.mock('../SentTicket', () => () => <></>)

describe('TransferredTickets', () => {
	it('renders received tickets and action buttons', () => {
		render(<TransferredTickets type="received" />, { wrapper: TestWrapper })
		expect(screen.getByText('common.actions.reject')).toBeTruthy()
		expect(screen.getByText('common.actions.accept')).toBeTruthy()
	})

	it('renders sent tickets and action buttons', () => {
		render(<TransferredTickets type="sent" />, { wrapper: TestWrapper })
		expect(screen.getByText('common.actions.cancel')).toBeTruthy()
	})
})
