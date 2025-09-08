import { describe, it, expect, jest } from '@jest/globals'
import {
	render,
	screen,
	fireEvent,
	waitFor
} from '@testing-library/react-native'
import React from 'react'

import { useCheckNickname } from '@/hooks/queries/auth/useCheckNickname'
import { useAuth } from '@/hooks/useAuth'
import { useSignUpStore } from '@/stores/signUpStore'
import { formatPhone } from '@/utils/formatters'

import { TestWrapper } from '../../testUtils/TestWrapper'
import CheckProfileForm from '../CheckProfileForm'

jest.mock('@/hooks/useAuth')
jest.mock('@/hooks/queries/auth/useCheckNickname')
jest.mock('@/stores/signUpStore')

jest.mock('@/utils/schemas', () => {
	const { z } = require('zod')
	return {
		UserSchema: {
			checkProfileInput: z.object({
				nickname: z.string().min(1),
				birth: z.string().nullable()
			})
		}
	}
})

const mockedUseAuth = useAuth as jest.Mock
const mockedUseCheckNickname = useCheckNickname as jest.Mock
const mockedUseSignUpStore = useSignUpStore as jest.Mocked<
	typeof useSignUpStore
>

const mockUser = {
	name: 'Test User',
	phone: '01012345678',
	email: 'test@example.com',
	birthYYYYMMDD: '19900101',
	verified: true
}

describe('CheckProfileForm', () => {
	it('renders form with user data and handles nickname submission', async () => {
		const signUp = jest.fn()
		const checkNickname = jest
			.fn<() => Promise<unknown>>()
			.mockResolvedValue({ success: true })
		mockedUseAuth.mockReturnValue({ signUp })
		mockedUseCheckNickname.mockReturnValue({ mutateAsync: checkNickname })
		mockedUseSignUpStore.mockReturnValue(mockUser)

		render(<CheckProfileForm />, { wrapper: TestWrapper })

		expect(screen.getByDisplayValue('Test User')).toBeTruthy()
		expect(screen.getByDisplayValue(formatPhone(mockUser.phone))).toBeTruthy()
		expect(screen.getByDisplayValue('test@example.com')).toBeTruthy()

		const nicknameInput = screen.getByPlaceholderText(
			'profile.placeholders.nickname'
		)
		const submitButton = screen.getByTestId('submit-button')

		expect(submitButton.props.accessibilityState.disabled).toBe(true)

		fireEvent.changeText(nicknameInput, 'new_nickname')

		expect(submitButton.props.accessibilityState.disabled).toBe(false)

		fireEvent.press(submitButton)

		await waitFor(() => {
			expect(checkNickname).toHaveBeenCalledWith('new_nickname')
		})

		await waitFor(() => {
			expect(signUp).toHaveBeenCalledWith({
				...mockUser,
				nickname: 'new_nickname',
				birthYYYYMMDD: null
			})
		})
	})

	it('shows error message on duplicate nickname', async () => {
		const signUp = jest.fn()
		const checkNickname = jest
			.fn<() => Promise<unknown>>()
			.mockResolvedValue({ success: false })
		mockedUseAuth.mockReturnValue({ signUp })
		mockedUseCheckNickname.mockReturnValue({ mutateAsync: checkNickname })
		mockedUseSignUpStore.mockReturnValue(mockUser)

		render(<CheckProfileForm />, { wrapper: TestWrapper })

		const nicknameInput = screen.getByPlaceholderText(
			'profile.placeholders.nickname'
		)
		const submitButton = screen.getByTestId('submit-button')

		fireEvent.changeText(nicknameInput, 'duplicate_nickname')
		fireEvent.press(submitButton)

		await waitFor(() => {
			expect(checkNickname).toHaveBeenCalledWith('duplicate_nickname')
		})

		expect(
			await screen.findByText('profile.errors.duplicatedNickname')
		).toBeTruthy()
		expect(signUp).not.toHaveBeenCalled()
	})
})
