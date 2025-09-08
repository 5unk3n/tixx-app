import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import EmptyEvents from '../EmptyEvents'

// Mock the SVG import
jest.mock('@/assets/illustrations/disco-ball.svg', () => 'DiscoBall')

describe('EmptyEvents', () => {
	it('renders the correct texts', () => {
		render(<EmptyEvents />, { wrapper: TestWrapper })

		// Check for the main title
		const title = screen.getByText('Event Comming Soon !')
		expect(title).toBeTruthy()

		// Check for the subtitle
		const subtitle = screen.getByText('이벤트가 곧 업데이트 됩니다.')
		expect(subtitle).toBeTruthy()
	})
})
