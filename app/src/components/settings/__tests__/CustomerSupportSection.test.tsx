import { describe, it, expect, jest } from '@jest/globals'
import { useNavigation } from '@react-navigation/native'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'

import { TestWrapper } from '../../testUtils/TestWrapper'
import CustomerSupportSection from '../CustomerSupportSection'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: jest.fn()
}))

const mockedUseNavigation = useNavigation as jest.Mock

describe('CustomerSupportSection', () => {
	it('renders links and handles press', () => {
		const navigate = jest.fn()
		const openURL = jest
			.spyOn(Linking, 'openURL')
			.mockImplementation(() => Promise.resolve())
		mockedUseNavigation.mockReturnValue({ navigate })

		render(<CustomerSupportSection />, { wrapper: TestWrapper })

		fireEvent.press(screen.getByText('common.settings.feedback'))
		expect(navigate).toHaveBeenCalledWith('Feedback')

		fireEvent.press(screen.getByText('common.settings.apply'))
		expect(openURL).toHaveBeenCalledWith('https://admin.tixx.site')
	})
})
