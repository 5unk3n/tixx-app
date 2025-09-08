import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import CancelBottomSheet from '../CancelBottomSheet'

jest.mock('@/hooks/queries/eventTickets/useDeleteEventTickets', () => ({
	useDeleteEventTickets: () => ({ mutateAsync: jest.fn() })
}))

jest.mock('../../ui/feedback/CustomBottomSheet', () => {
	const React = require('react')
	const { View } = require('react-native')
	return React.forwardRef((props: any, _ref: any) => <View {...props} />)
})

const groupedEventTicket = {
	ids: [1, 2],
	event: { tags: [] },
	ticket: { startAt: new Date(), endAt: new Date() }
} as any

describe('CancelBottomSheet', () => {
	it('renders correctly', () => {
		render(
			<CancelBottomSheet
				groupedEventTicket={groupedEventTicket}
				isBottomSheetOpen={true}
				onDismiss={() => {}}
			/>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('tickets.cancel.title')).toBeTruthy()
	})
})
