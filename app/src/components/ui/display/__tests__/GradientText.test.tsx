import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import GradientText from '../GradientText'

describe('GradientText', () => {
	it('renders children correctly', () => {
		render(<GradientText colors={[]}>Child</GradientText>, {
			wrapper: TestWrapper
		})
		expect(screen.getAllByText('Child').length).toBeGreaterThan(0)
	})
})
