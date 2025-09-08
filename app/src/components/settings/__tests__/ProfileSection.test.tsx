import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import ProfileSection from '../ProfileSection'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

describe('ProfileSection', () => {
	it('renders profile section items', () => {
		render(<ProfileSection />, { wrapper: TestWrapper })
		expect(screen.getByText('common.orderHistory')).toBeTruthy()
		expect(screen.getByText('common.settings.feedback')).toBeTruthy()
		expect(screen.getByText('common.contactUs')).toBeTruthy()
	})

	it('opens contact us dialog', () => {
		render(<ProfileSection />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('common.contactUs'))
		expect(screen.getByText('common.contactUs.selectMethod')).toBeTruthy()
	})
})
