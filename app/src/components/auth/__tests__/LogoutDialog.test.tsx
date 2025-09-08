import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { useAuth } from '@/hooks/useAuth'

import { TestWrapper } from '../../testUtils/TestWrapper'
import LogoutDialog from '../LogoutDialog'

jest.mock('@/hooks/useAuth')

const mockedUseAuth = useAuth as jest.Mock

describe('LogoutDialog', () => {
	it('renders correctly and handles actions', () => {
		const onDismiss = jest.fn()
		const logout = jest.fn()
		mockedUseAuth.mockReturnValue({ logout })

		render(<LogoutDialog visible={true} onDismiss={onDismiss} />, {
			wrapper: TestWrapper
		})

		expect(screen.getByText('auth.confirmLogout')).toBeTruthy()

		const confirmButton = screen.getByText('common.confirm')
		fireEvent.press(confirmButton)
		expect(logout).toHaveBeenCalled()

		const cancelButton = screen.getByText('common.cancel')
		fireEvent.press(cancelButton)
		expect(onDismiss).toHaveBeenCalled()
	})
})
