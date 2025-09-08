import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import BlurredChip from '../BlurredChip'

describe('BlurredChip', () => {
	it('renders children correctly', () => {
		render(<BlurredChip>Test Chip</BlurredChip>, { wrapper: TestWrapper })
		expect(screen.getByText('Test Chip')).toBeTruthy()
	})

	it('applies size prop correctly', () => {
		const { rerender } = render(<BlurredChip size="sm">Small</BlurredChip>, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('Small')).toBeTruthy()

		rerender(<BlurredChip size="md">Medium</BlurredChip>)
		expect(screen.getByText('Medium')).toBeTruthy()
	})
})
