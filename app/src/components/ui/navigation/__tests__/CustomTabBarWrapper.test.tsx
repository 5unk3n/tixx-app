import { describe, it, expect, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomTabBar from '../CustomTabBar'
import CustomTabBarWrapper from '../CustomTabBarWrapper'

// Mock the actual CustomTabBar to check the props it receives
jest.mock('../CustomTabBar', () => jest.fn(() => null))

const mockProps = {
	state: { routes: [], index: 0 },
	descriptors: {},
	navigation: {}
} as any

describe('CustomTabBarWrapper', () => {
	it('renders CustomTabBar and passes props to it', () => {
		render(<CustomTabBarWrapper {...mockProps} />, {
			wrapper: TestWrapper
		})
		// Check that CustomTabBar was called with the correct props
		expect(CustomTabBar).toHaveBeenCalledWith(mockProps, {})
	})
})
