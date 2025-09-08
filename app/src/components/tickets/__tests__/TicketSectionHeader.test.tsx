import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import { format } from 'date-fns'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import TicketSectionHeader from '../TicketSectionHeader'

describe('TicketSectionHeader', () => {
	it("renders today's date correctly", () => {
		const today = format(new Date(), 'yyyyMMdd')
		render(
			<TicketSectionHeader date={today} eventTickets={[{ id: 1 } as any]} />,
			{
				wrapper: TestWrapper
			}
		)
		expect(screen.getByText('Today')).toBeTruthy()
		expect(screen.getByText('1')).toBeTruthy()
	})
})
