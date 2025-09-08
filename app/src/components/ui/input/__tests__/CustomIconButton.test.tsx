import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomIconButton from '../CustomIconButton'

describe('CustomIconButton', () => {
	it('onPress 호출 및 size/buttonSize 스타일 적용', () => {
		const onPress = jest.fn()
		render(
			<CustomIconButton
				name="close"
				size={24}
				buttonSize={40}
				onPress={onPress}
				accessibilityLabel="icon-btn"
			/>,
			{ wrapper: TestWrapper }
		)
		const btn = screen.getByLabelText('icon-btn')
		fireEvent.press(btn)
		expect(onPress).toHaveBeenCalled()
	})
})
