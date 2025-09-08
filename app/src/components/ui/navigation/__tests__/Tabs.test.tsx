import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import Tabs from '../Tabs'

describe('Tabs', () => {
	it('should render tabs and handle selection change', () => {
		const onChangeMock = jest.fn()
		render(
			<Tabs value="a" onChange={onChangeMock}>
				<Tabs.Tab value="a" label="Tab A" />
				<Tabs.Tab value="b" label="Tab B" />
			</Tabs>,
			{ wrapper: TestWrapper }
		)

		expect(screen.getByText('Tab A')).toBeTruthy()
		expect(screen.getByText('Tab B')).toBeTruthy()

		fireEvent.press(screen.getByText('Tab B'))
		expect(onChangeMock).toHaveBeenCalledWith('b')
	})

	describe('should render correctly based on type and active state', () => {
		const types = ['underline', 'outline', 'dot'] as const
		const values = ['a', 'b']

		types.forEach((type) => {
			values.forEach((value) => {
				it(`renders correctly for type '${type}' with active tab '${value}'`, () => {
					const { toJSON } = render(
						<Tabs value={value} onChange={jest.fn()} type={type}>
							<Tabs.Tab value="a" label="Tab A" />
							<Tabs.Tab value="b" label="Tab B" />
						</Tabs>,
						{ wrapper: TestWrapper }
					)
					expect(toJSON()).toMatchSnapshot()
				})
			})
		})
	})
})
