import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import SentTicket from '../SentTicket'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

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
	toUser: { nickname: 'Receiver' }
} as any

describe('SentTicket', () => {
	it('renders status text with receiver nickname and status', () => {
		render(<SentTicket transferredEventTicket={transferredEventTicket} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('tickets.to', { exact: false })).toBeTruthy()
		expect(
			screen.getByText('common.status.waiting', { exact: false })
		).toBeTruthy()
	})
})
