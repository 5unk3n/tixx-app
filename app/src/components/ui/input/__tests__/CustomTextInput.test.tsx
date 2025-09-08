import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { TextInput } from 'react-native'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomTextInput, { CustomTextInputProps } from '../CustomTextInput'

describe('CustomTextInput', () => {
	it('should handle text input correctly', () => {
		const onChangeTextMock = jest.fn()
		render(
			<CustomTextInput
				value="initial"
				onChangeText={onChangeTextMock}
				accessibilityLabel="text-input"
			/>,
			{ wrapper: TestWrapper }
		)

		const input = screen.getByLabelText('text-input')
		fireEvent.changeText(input, 'new text')
		expect(onChangeTextMock).toHaveBeenCalledWith('new text')
	})

	it('should focus the input when the label is pressed', () => {
		// Mock the focus method
		const mockFocus = jest.fn()
		jest.spyOn(TextInput.prototype, 'focus').mockImplementation(mockFocus)

		render(
			<CustomTextInput label="이메일" value="" onChangeText={() => {}} />,
			{ wrapper: TestWrapper }
		)

		fireEvent.press(screen.getByText('이메일'))
		expect(mockFocus).toHaveBeenCalledTimes(1)

		// Restore original implementation
		mockFocus.mockRestore()
	})

	describe('should render correctly based on props', () => {
		const testCases: Array<Partial<CustomTextInputProps>> = [
			{ errorMessage: '오류 메시지' },
			{ right: <TextInput testID="right-element" /> },
			{ disabled: true },
			{ numberOfLines: 3, multiline: true },
			{ label: '레이블', right: <></>, errorMessage: '오류' }
		]

		testCases.forEach((props, i) => {
			it(`renders correctly for case ${i + 1}`, () => {
				const { toJSON } = render(
					<CustomTextInput value="test" onChangeText={() => {}} {...props} />,
					{ wrapper: TestWrapper }
				)
				expect(toJSON()).toMatchSnapshot()
			})
		})
	})
})
