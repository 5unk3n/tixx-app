import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import AgreementForm from '../AgreementForm'

jest.mock('@/stores/signUpStore', () => ({
	useSignUpStore: (selector: any) =>
		selector({
			setOAuthData: jest.fn()
		})
}))

describe('AgreementForm', () => {
	it('enables submit button when required terms are checked', () => {
		render(<AgreementForm />, { wrapper: TestWrapper })
		const submitButton = screen.getByTestId('next-button')
		expect(submitButton).toBeDefined()

		expect(submitButton.props.accessibilityState.disabled).toBe(true)

		fireEvent.press(screen.getByText('auth.terms.ageVerification'))
		fireEvent.press(screen.getByText('auth.terms.serviceAgreement'))
		fireEvent.press(screen.getByText('auth.terms.privacyPolicy'))

		expect(submitButton.props.accessibilityState.disabled).toBe(false)
	})
})
