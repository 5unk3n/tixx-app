import { describe, it, expect, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import { MainTabHeader, MyPageHeader } from '../BottomTabHeader'

// Mock react-navigation hooks used by the child CustomHeader
jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({}),
	useRoute: () => ({ name: 'MockedScreen', params: {} }),
	useFocusEffect: jest.fn()
}))

describe('BottomTabHeader', () => {
	it('should render MainTabHeader correctly', () => {
		const { toJSON } = render(<MainTabHeader />, { wrapper: TestWrapper })
		expect(toJSON()).toMatchSnapshot()
	})

	it('should render MyPageHeader correctly', () => {
		const props = {
			options: { title: '마이페이지' }
		} as any
		const { toJSON } = render(<MyPageHeader {...props} />, {
			wrapper: TestWrapper
		})
		expect(toJSON()).toMatchSnapshot()
	})
})
