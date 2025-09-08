import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomListItem from '../CustomListItem'

describe('CustomListItem', () => {
	it('renders title and description correctly', () => {
		render(
			<CustomListItem title="Test Title" description="Test Description" />,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('Test Title')).toBeTruthy()
		expect(screen.getByText('Test Description')).toBeTruthy()
	})

	it('renders rightElement when provided', () => {
		const RightComponent = () => <View testID="right-element" />
		render(<CustomListItem title="Test" rightElement={<RightComponent />} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByTestId('right-element')).toBeTruthy()
	})

	it('passes other ListItemProps to the underlying List.Item component', () => {
		render(
			<CustomListItem title="Test" accessibilityLabel="list-item-label" />,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByLabelText('list-item-label')).toBeTruthy()
	})
})
