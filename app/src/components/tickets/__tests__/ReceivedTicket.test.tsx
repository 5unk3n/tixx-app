import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import ReceivedTicket from '../ReceivedTicket'

jest.mock('../TicketListItem', () => (props: any) => {
	const React = require('react')
	const { View, Text } = require('react-native')
	return (
		<View>
			<Text>{props.statusText}</Text>
		</View>
	)
})

const transferredEventTicket = {
	id: 1,
	status: 1,
	eventTicket: {},
	fromUser: { nickname: 'Sender' }
} as any

describe('ReceivedTicket', () => {
	it('renders status text with sender nickname', () => {
		render(<ReceivedTicket transferredEventTicket={transferredEventTicket} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('tickets.from', { exact: false })).toBeTruthy()
	})
})
