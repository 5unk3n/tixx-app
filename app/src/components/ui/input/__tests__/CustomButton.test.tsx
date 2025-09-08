import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomButton, { CustomButtonProps } from '../CustomButton'

describe('CustomButton', () => {
	it('should call onPress handler when clicked', () => {
		const onPressMock = jest.fn()
		render(
			<CustomButton onPress={onPressMock} accessibilityLabel="custom-btn">
				확인
			</CustomButton>,
			{ wrapper: TestWrapper }
		)

		const button = screen.getByLabelText('custom-btn')
		fireEvent.press(button)

		expect(onPressMock).toHaveBeenCalledTimes(1)
	})

	describe('should apply styles based on props', () => {
		// Define various combinations of props to test
		const testCases: Array<Partial<CustomButtonProps>> = [
			{ size: 'sm', mode: 'contained' },
			{ size: 'md', mode: 'outlined' },
			{ size: 'lg', mode: 'text' },
			{ colorVariant: 'primary', disabled: true },
			{ colorVariant: 'secondary', mode: 'contained' },
			{ flex: true },
			{ labelVariant: 'headline1Semibold' }
		]

		// Dynamically create a test for each combination
		testCases.forEach((props, i) => {
			it(`renders correctly for props combination ${i + 1}`, () => {
				const { toJSON } = render(
					<CustomButton {...props}>버튼</CustomButton>,
					{ wrapper: TestWrapper }
				)
				// Compare the rendered output with a stored snapshot
				expect(toJSON()).toMatchSnapshot()
			})
		})
	})
})
