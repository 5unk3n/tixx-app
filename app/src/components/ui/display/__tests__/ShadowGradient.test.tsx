import { describe, it, expect, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import ShadowGradient from '../ShadowGradient'

jest.unmock('react-native-linear-gradient')

describe('ShadowGradient', () => {
	it('renders correctly for each type and matches snapshot', () => {
		const types = ['1', '2', '2-2', '3', 'main'] as const
		types.forEach((type) => {
			const { toJSON } = render(<ShadowGradient type={type} />, {
				wrapper: TestWrapper
			})
			// Create a snapshot for each type to verify correct props are passed
			expect(toJSON()).toMatchSnapshot()
		})
	})
})
