import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomCheckbox from '../CustomCheckbox'

describe('CustomCheckbox', () => {
	it('should toggle checked state and render label', () => {
		const onChangeMock = jest.fn()
		render(
			<CustomCheckbox checked={false} label="동의" onChange={onChangeMock} />,
			{ wrapper: TestWrapper }
		)

		// Pressing the label should trigger onChange with the new value
		fireEvent.press(screen.getByText('동의'))
		expect(onChangeMock).toHaveBeenCalledWith(true)
	})

	describe('should reflect icon position and type', () => {
		// Test cases for different props combinations
		const testCases = [
			{ iconPosition: 'left', iconType: 'minimal', checked: true },
			{ iconPosition: 'right', iconType: 'minimal', checked: false },
			{ iconPosition: 'left', iconType: 'square', checked: true },
			{ iconPosition: 'right', iconType: 'square', checked: false }
		] as const

		testCases.forEach((props) => {
			it(`renders correctly for ${JSON.stringify(props)}`, () => {
				const { toJSON } = render(
					<CustomCheckbox label="옵션" onChange={jest.fn()} {...props} />,
					{ wrapper: TestWrapper }
				)
				// Compare with snapshot to verify structural changes (icon order, icon name)
				expect(toJSON()).toMatchSnapshot()
			})
		})
	})
})
