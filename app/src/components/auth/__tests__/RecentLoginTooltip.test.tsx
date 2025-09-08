import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import RecentLoginTooltip from '../RecentLoginTooltip'

describe('RecentLoginTooltip', () => {
	it('renders the tooltip text', () => {
		render(<RecentLoginTooltip />, { wrapper: TestWrapper })
		expect(screen.getByText('auth.lastLogin')).toBeTruthy()
	})
})
