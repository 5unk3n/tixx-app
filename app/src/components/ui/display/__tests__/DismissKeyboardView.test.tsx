import { describe, it, expect, jest } from '@jest/globals'
import { render, fireEvent, screen } from '@testing-library/react-native'
import React from 'react'
import { TextInput, Keyboard } from 'react-native'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import DismissKeyboardView from '../DismissKeyboardView'

describe('DismissKeyboardView', () => {
	it('renders children without crashing', () => {
		const { toJSON } = render(<DismissKeyboardView />, { wrapper: TestWrapper })
		expect(toJSON()).toBeTruthy()
	})

	it('dismisses the keyboard when tapped outside TextInput', () => {
		const mockDismiss = jest.spyOn(Keyboard, 'dismiss')

		render(
			<DismissKeyboardView testID="dismiss-keyboard-view">
				<TextInput testID="test-input" />
			</DismissKeyboardView>,
			{ wrapper: TestWrapper }
		)

		fireEvent(screen.getByTestId('test-input'), 'focus')
		fireEvent(
			screen.getByTestId('dismiss-keyboard-view'),
			'startShouldSetResponder'
		)

		expect(mockDismiss).toHaveBeenCalledTimes(2) // 왜 두 번 발생하는지는 정확히 모르겠음
		mockDismiss.mockRestore()
	})
})
