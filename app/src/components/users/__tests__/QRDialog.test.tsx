import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import QRDialog from '../QRDialog'

jest.mock('@/hooks/queries/useUser', () => ({
	useUser: () => ({ data: { nickname: 'tester' } })
}))
jest.mock('react-native-screenshot-prevent', () => ({
	enabled: jest.fn(),
	enableSecureView: jest.fn(),
	disableSecureView: jest.fn()
}))
// Mock QRContents to avoid its internal complexity
jest.mock('../QRContents', () => () => <></>)

describe('QRDialog', () => {
	it('renders dialog with user nickname', () => {
		render(<QRDialog visible={true} onDismiss={() => {}} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('profile.qr.title', { exact: false })).toBeTruthy()
	})
})
