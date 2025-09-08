import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import AppSettingsSection from '../AppSettingsSection'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: jest.fn()
	})
}))

jest.mock('@/hooks/useAppVersion', () => ({
	useAppVersion: () => ({ currentVersion: '1.0.0', latestVersion: '1.0.1' })
}))

jest.mock('@/hooks/useDeveloperMode', () => ({
	useDeveloperMode: () => ({
		handlePress: jest.fn(),
		handleLongPress: jest.fn(),
		isDevModeUnlocked: false
	})
}))

describe('AppSettingsSection', () => {
	it('renders settings items', () => {
		render(<AppSettingsSection />, { wrapper: TestWrapper })
		expect(screen.getByText('common.settings.appVersion')).toBeTruthy()
		expect(screen.getByText('common.settings.terms')).toBeTruthy()
		expect(screen.getByText('common.settings.language')).toBeTruthy()
		expect(screen.getByText('auth.logout')).toBeTruthy()
		expect(screen.getByText('auth.accountDeletion')).toBeTruthy()
	})
})
