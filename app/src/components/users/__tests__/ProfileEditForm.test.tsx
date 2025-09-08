import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import ProfileEditForm from '../ProfileEditForm'

jest.mock('@/hooks/queries/useUser', () => ({
	useUser: () => ({
		data: {
			name: 'Test User',
			nickname: 'tester',
			phone: '01012345678',
			email: 'test@test.com'
		},
		isPending: false,
		isError: false
	})
}))
jest.mock('@/hooks/queries/auth/useCheckNickname', () => ({
	useCheckNickname: () => ({ mutateAsync: jest.fn() })
}))
jest.mock('@/hooks/queries/useUpdateUser', () => ({
	useUpdateUser: () => ({ mutateAsync: jest.fn() })
}))

describe('ProfileEditForm', () => {
	it('renders user profile information', () => {
		render(<ProfileEditForm isEditable={false} />, { wrapper: TestWrapper })
		expect(screen.getByDisplayValue('Test User')).toBeTruthy()
		expect(screen.getByDisplayValue('tester')).toBeTruthy()
	})
})
