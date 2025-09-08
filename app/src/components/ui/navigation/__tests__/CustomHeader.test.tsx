import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomHeader from '../CustomHeader'

// Mock child components and hooks
jest.mock('../../display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => (
		<View testID={`icon-${name}`} {...props} />
	)
})

jest.mock('react-native-toast-message', () => ({
	__esModule: true,
	default: { show: jest.fn() },
	show: jest.fn()
}))

const mockNavigate = jest.fn()
const mockGoBack = jest.fn()
jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: mockNavigate,
		goBack: mockGoBack
	}),
	useRoute: () => ({}),
	useFocusEffect: jest.fn()
}))

describe('CustomHeader', () => {
	beforeEach(() => {
		mockNavigate.mockClear()
		mockGoBack.mockClear()
	})

	it('should call navigation.goBack when back button is pressed', () => {
		render(<CustomHeader hasBack />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByTestId('icon-arrowLeft'))
		expect(mockGoBack).toHaveBeenCalledTimes(1)
	})

	describe('should render correctly based on props', () => {
		const testCases = [
			{ title: '타이틀', hasBack: true },
			{
				hasLogo: true,
				hasMap: true,
				hasAddTicket: true,
				hasNotification: true
			},
			{ title: '편집', hasEdit: true },
			{ title: '설정', hasSettings: true, hasProfileEdit: true },
			{ isBgTransparent: true }
		]

		testCases.forEach((props, i) => {
			it(`renders correctly for case ${i + 1}`, () => {
				const { toJSON } = render(<CustomHeader {...props} />, {
					wrapper: TestWrapper
				})
				expect(toJSON()).toMatchSnapshot()
			})
		})
	})
})
