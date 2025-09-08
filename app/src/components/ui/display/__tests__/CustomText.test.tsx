import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { StyleSheet } from 'react-native'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import { CustomText } from '../CustomText'

describe('CustomText', () => {
	it('renders children correctly', () => {
		render(<CustomText>Hello World</CustomText>, { wrapper: TestWrapper })
		const textElement = screen.getByText('Hello World')
		expect(textElement).toBeTruthy()
	})

	it('applies variant prop correctly', () => {
		render(<CustomText variant="body1Medium">Test</CustomText>, {
			wrapper: TestWrapper
		})
		const textElement = screen.getByText('Test')
		const textStyle = StyleSheet.flatten(textElement.props.style)
		expect(textStyle).toHaveProperty('fontFamily', 'Pretendard-Medium')
		expect(textStyle).toHaveProperty('fontSize', 16)
		expect(textStyle).toHaveProperty('fontWeight', '500')
		expect(textStyle).toHaveProperty('lineHeight', 18)
		expect(textStyle).toHaveProperty('letterSpacing', -0.02)
	})

	it('passes other props to the underlying Text component', () => {
		render(<CustomText accessibilityLabel="test-label">Test</CustomText>, {
			wrapper: TestWrapper
		})
		const textElement = screen.getByLabelText('test-label')
		expect(textElement).toBeTruthy()
	})
})
