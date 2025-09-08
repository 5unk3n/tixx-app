import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import NotificationSection from '../NotificationSection'

jest.mock('@/hooks/queries/useUpdateUser', () => ({
	useUpdateUser: () => ({ mutate: jest.fn() })
}))

jest.mock('react-native-permissions', () => ({
	checkNotifications: () => Promise.resolve({ status: 'granted' })
}))

const user = { marketingOptIn: 1 } as any

describe('NotificationSection', () => {
	it('renders notification settings', () => {
		render(<NotificationSection user={user} />, { wrapper: TestWrapper })
		expect(
			screen.getAllByText('common.notification.title').length
		).toBeGreaterThan(0)
		expect(screen.getByText('common.notification.marketing')).toBeTruthy()
	})
})
