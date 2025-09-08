import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import GradientBorderView from '../GradientBorderView'

describe('GradientBorderView', () => {
	it('renders children correctly', () => {
		render(
			<GradientBorderView borderRadius={10} borderWidth={1} colors={[]}>
				<Text>Child</Text>
			</GradientBorderView>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('Child')).toBeTruthy()
	})
})
