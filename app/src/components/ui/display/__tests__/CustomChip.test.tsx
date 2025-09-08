import {
	describe,
	it,
	expect,
	jest,
	afterEach,
	beforeEach
} from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { Chip, ChipProps } from 'react-native-paper'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomChip from '../CustomChip'

jest.mock('react-native-paper', () => {
	const RNPaper = jest.requireActual(
		'react-native-paper'
	) as typeof import('react-native-paper')
	const { View, Text } = jest.requireActual(
		'react-native'
	) as typeof import('react-native')
	return {
		...RNPaper,
		Chip: jest.fn((props: ChipProps) => (
			<View testID="test-chip" {...props}>
				<Text>{props.children}</Text>
			</View>
		))
	}
})

describe('CustomChip', () => {
	let mockChip: jest.Mock

	beforeEach(() => {
		mockChip = Chip as jest.Mock
	})

	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks() // Restore original implementations for safety
	})

	it('renders children correctly', () => {
		render(<CustomChip>Test Chip</CustomChip>, { wrapper: TestWrapper })
		const chipElement = screen.getByTestId('test-chip') // Use testID for more stable query
		expect(screen.getByText('Test Chip')).toBeTruthy()
		expect(chipElement).toBeTruthy()
	})

	it('applies style prop correctly', () => {
		render(<CustomChip style={{ backgroundColor: 'blue' }}>Test</CustomChip>, {
			wrapper: TestWrapper
		})
		expect(mockChip).toHaveBeenCalledWith(
			expect.objectContaining({
				style: expect.arrayContaining([
					expect.objectContaining({ backgroundColor: 'blue' })
				])
			}),
			expect.anything()
		)
	})

	it('applies textStyle prop correctly', () => {
		render(<CustomChip textStyle={{ color: 'green' }}>Test</CustomChip>, {
			wrapper: TestWrapper
		})
		expect(mockChip).toHaveBeenCalledWith(
			expect.objectContaining({
				textStyle: expect.arrayContaining([
					expect.objectContaining({ color: 'green' })
				])
			}),
			expect.anything()
		)
	})

	it('passes other ChipProps to the underlying Chip component', () => {
		render(<CustomChip accessibilityLabel="chip-label">Test</CustomChip>, {
			wrapper: TestWrapper
		})
		expect(mockChip).toHaveBeenCalledWith(
			expect.objectContaining({
				accessibilityLabel: 'chip-label'
			}),
			expect.anything()
		)
	})
})
