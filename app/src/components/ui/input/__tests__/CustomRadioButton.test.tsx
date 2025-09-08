import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import { CustomRadioButton } from '../CustomRadioButton'

describe('CustomRadioButton', () => {
	it('should switch selection state within a context', () => {
		const onChangeMock = jest.fn()
		render(
			<CustomRadioButton.Group value="a" onChange={onChangeMock}>
				<CustomRadioButton.Button value="a" label="옵션A" />
				<CustomRadioButton.Button value="b" label="옵션B" />
			</CustomRadioButton.Group>,
			{ wrapper: TestWrapper }
		)

		fireEvent.press(screen.getByText('옵션B'))
		expect(onChangeMock).toHaveBeenCalledWith('b')
	})

	describe('should render correctly based on props', () => {
		const testCases = [
			{ value: 'a', iconType: 'minimal' }, // Unchecked minimal
			{ value: 'b', iconType: 'minimal' }, // Checked minimal
			{ value: 'c', iconType: 'rounded' }, // Unchecked rounded
			{ value: 'd', iconType: 'rounded' } // Checked rounded
		] as const

		testCases.forEach(({ value, iconType }) => {
			it(`renders correctly for value '${value}' with iconType '${iconType}'`, () => {
				const { toJSON } = render(
					<CustomRadioButton.Group value={'b'} onChange={jest.fn()}>
						<CustomRadioButton.Button
							value={value}
							label={`옵션 ${value}`}
							iconType={iconType}
						/>
					</CustomRadioButton.Group>,
					{ wrapper: TestWrapper }
				)
				expect(toJSON()).toMatchSnapshot()
			})
		})
	})
})
