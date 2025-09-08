import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import {
	render,
	fireEvent,
	waitFor,
	screen
} from '@testing-library/react-native'
import React from 'react'

import { useCheckPhoneNumber } from '@/hooks/queries/users/useCheckPhoneNumber'
import { usePhoneVerification } from '@/hooks/usePhoneVerification'

import { TestWrapper } from '../../testUtils/TestWrapper'
import VerifyPhoneForm from '../VerifyPhoneForm'

// Mock hooks and dependencies
jest.mock('@/hooks/queries/users/useCheckPhoneNumber')
jest.mock('@/hooks/usePhoneVerification')
jest.mock('react-native-toast-message', () => ({
	__esModule: true,
	default: {
		show: jest.fn()
	}
}))

// Mock CustomBottomSheet since it involves native code
jest.mock('../../ui/feedback/CustomBottomSheet', () => {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const React = require('react')
	return {
		__esModule: true,
		default: React.forwardRef((props: any, ref: any) => {
			if (ref) {
				ref.current = { present: jest.fn(), dismiss: jest.fn() }
			}
			return <div {...props}>{props.children}</div>
		})
	}
})

jest.mock('libphonenumber-js', () => {
	const original = jest.requireActual(
		'libphonenumber-js'
	) as typeof import('libphonenumber-js')
	return {
		...original,
		getExampleNumber: jest.fn(() => ({
			formatNational: () => '010 1234 5678'
		})),
		AsYouType: jest.fn().mockImplementation(() => ({
			input: (text: string) => text,
			reset: jest.fn()
		}))
	}
})

const mockUseCheckPhoneNumber = useCheckPhoneNumber as jest.Mock
const mockUsePhoneVerification = usePhoneVerification as jest.Mock

describe('VerifyPhoneForm', () => {
	const mockOnSubmit = jest.fn<() => Promise<unknown>>()
	const mockRequestCode = jest.fn<() => Promise<unknown>>()
	const mockVerifyCode = jest.fn<() => Promise<unknown>>()

	beforeEach(() => {
		jest.clearAllMocks()
		mockUseCheckPhoneNumber.mockReturnValue({ mutateAsync: jest.fn() })
		mockUsePhoneVerification.mockReturnValue({
			requestCode: mockRequestCode,
			verifyCode: mockVerifyCode,
			remainingTime: '3:00',
			isCodeSent: false,
			isResendDisabled: false,
			firstReqTime: null,
			reqCount: 0
		})
	})

	it('renders initial form correctly', () => {
		render(<VerifyPhoneForm onSubmit={mockOnSubmit} />, {
			wrapper: TestWrapper
		})

		expect(screen.getByText('profile.fields.phone')).toBeTruthy()
		expect(screen.getByText('+82')).toBeTruthy() // Default country code
		expect(screen.getByText('common.send')).toBeTruthy()
	})

	it('requests a verification code successfully and shows code input', async () => {
		const mockCheckPhone = jest
			.fn<() => Promise<unknown>>()
			.mockResolvedValue(null) // New user
		mockUseCheckPhoneNumber.mockReturnValue({ mutateAsync: mockCheckPhone })
		mockRequestCode.mockResolvedValue(undefined)

		const { rerender } = render(<VerifyPhoneForm onSubmit={mockOnSubmit} />, {
			wrapper: TestWrapper
		})

		const phoneInput = screen.getByPlaceholderText('010 1234 5678')
		fireEvent.changeText(phoneInput, '1000000000')

		const sendButton = screen.getByText('common.send')
		fireEvent.press(sendButton)

		await waitFor(() => {
			expect(mockCheckPhone).toHaveBeenCalledWith('+821000000000')
		})
		await waitFor(() => {
			expect(mockRequestCode).toHaveBeenCalledWith({ phone: '+821000000000' })
		})

		// Mock the hook to return the new state after the code is sent
		mockUsePhoneVerification.mockReturnValue({
			requestCode: mockRequestCode,
			verifyCode: mockVerifyCode,
			remainingTime: '3:00',
			isCodeSent: true,
			isResendDisabled: true,
			firstReqTime: new Date(),
			reqCount: 1
		})

		// Rerender the component with the new mock value
		rerender(<VerifyPhoneForm onSubmit={mockOnSubmit} />)

		// After code is sent, the UI should update
		expect(
			screen.getByPlaceholderText('auth.verification.codePlaceholder')
		).toBeTruthy()
		expect(screen.getByText('common.resend')).toBeTruthy()
	})

	it('shows error when phone number already exists', async () => {
		const mockCheckPhone = jest
			.fn<() => Promise<unknown>>()
			.mockResolvedValue({ id: 1 }) // Existing user
		mockUseCheckPhoneNumber.mockReturnValue({ mutateAsync: mockCheckPhone })

		render(<VerifyPhoneForm onSubmit={mockOnSubmit} />, {
			wrapper: TestWrapper
		})

		const phoneInput = screen.getByPlaceholderText('010 1234 5678')
		fireEvent.changeText(phoneInput, '1011112222')

		const sendButton = screen.getByText('common.send')
		fireEvent.press(sendButton)

		await waitFor(() => {
			expect(mockCheckPhone).toHaveBeenCalledWith('+821011112222')
		})

		await waitFor(() => {
			expect(
				require('react-native-toast-message').default.show
			).toHaveBeenCalledWith({
				type: 'error',
				text1: 'auth.errors.alreadyExistPhone'
			})
		})
		expect(mockRequestCode).not.toHaveBeenCalled()
	})

	it('verifies the code and submits successfully', async () => {
		// To test this, we assume the code has already been sent.
		mockUsePhoneVerification.mockReturnValue({
			requestCode: mockRequestCode,
			verifyCode: mockVerifyCode.mockResolvedValue(true), // Mock successful verification
			remainingTime: '2:50',
			isCodeSent: true, // Assume code has been sent
			isResendDisabled: true,
			firstReqTime: new Date(),
			reqCount: 1
		})

		render(<VerifyPhoneForm onSubmit={mockOnSubmit} />, {
			wrapper: TestWrapper
		})

		// Set a phone number in the form state first
		const phoneInput = screen.getByPlaceholderText('010 1234 5678')
		fireEvent.changeText(phoneInput, '1000000000')

		const codeInput = screen.getByPlaceholderText(
			'auth.verification.codePlaceholder'
		)
		fireEvent.changeText(codeInput, '123456')

		const nextButton = screen.getByText('common.next')
		fireEvent.press(nextButton)

		await waitFor(() => {
			expect(mockVerifyCode).toHaveBeenCalledWith('+821000000000', '123456')
		})

		await waitFor(() => {
			expect(mockOnSubmit).toHaveBeenCalledWith('+821000000000', 0)
		})
	})

	it('allows skipping verification when conditions are met', async () => {
		// To test this, we assume the conditions for skipping are met.
		mockUsePhoneVerification.mockReturnValue({
			requestCode: mockRequestCode,
			verifyCode: mockVerifyCode,
			remainingTime: '0:00',
			isCodeSent: true,
			isResendDisabled: false,
			firstReqTime: new Date(Date.now() - 70000), // 70 seconds ago
			reqCount: 1
		})

		render(<VerifyPhoneForm onSubmit={mockOnSubmit} />, {
			wrapper: TestWrapper
		})

		const phoneInput = screen.getByPlaceholderText('010 1234 5678')
		fireEvent.changeText(phoneInput, '1055556666')

		const skipButton = screen.getByText('auth.verification.verifyLater')
		fireEvent.press(skipButton)

		await waitFor(() => {
			expect(mockOnSubmit).toHaveBeenCalledWith('+821055556666', 1)
		})
	})
})
