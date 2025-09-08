import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { ViewProps } from 'react-native'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomTabBar from '../CustomTabBar'

// Mock the child component to isolate the TabBar logic
jest.mock('../../input/CustomIconButton', () =>
	jest.fn((props: ViewProps) => {
		const { View } = require('react-native') as typeof import('react-native')
		return <View testID="custom-icon-button" {...props} />
	})
)

describe('CustomTabBar', () => {
	const mockNavigate = jest.fn()
	const mockEmit = jest.fn(() => ({ defaultPrevented: false }))

	const mockProps = {
		state: {
			index: 0,
			routes: [
				{ key: 'Home', name: 'Home', params: {} },
				{ key: 'Tickets', name: 'Tickets', params: {} }
			]
		},
		descriptors: {
			Home: { options: { tabBarAccessibilityLabel: 'Home tab' } },
			Tickets: { options: { tabBarAccessibilityLabel: 'Tickets tab' } }
		},
		navigation: {
			navigate: mockNavigate,
			emit: mockEmit
		}
	} as any

	beforeEach(() => {
		mockNavigate.mockClear()
		mockEmit.mockClear()
	})

	it('renders the correct number of tabs', () => {
		render(<CustomTabBar {...mockProps} />, { wrapper: TestWrapper })
		expect(screen.getAllByTestId('custom-icon-button')).toHaveLength(2)
	})

	it('navigates when a tab is pressed', () => {
		render(<CustomTabBar {...mockProps} />, { wrapper: TestWrapper })
		const secondTab = screen.getAllByTestId('custom-icon-button')[1]

		fireEvent.press(secondTab)

		// Check that navigation events were emitted and called
		expect(mockEmit).toHaveBeenCalledWith({
			type: 'tabPress',
			target: 'Tickets',
			canPreventDefault: true
		})
		expect(mockNavigate).toHaveBeenCalledWith('Tickets', {})
	})

	it('does not navigate if the tab is already focused', () => {
		render(<CustomTabBar {...mockProps} />, { wrapper: TestWrapper })
		const firstTab = screen.getAllByTestId('custom-icon-button')[0]

		fireEvent.press(firstTab)

		expect(mockEmit).toHaveBeenCalled()
		expect(mockNavigate).not.toHaveBeenCalled()
	})
})
