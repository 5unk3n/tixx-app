import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import QRContents from '../QRContents'

jest.mock('@/hooks/queries/users/useQRCode', () => ({
	useQRCode: () => ({
		QRCode: { imgUrl: 'http://example.com/qr.png' },
		remainingTime: 50,
		isFetching: false
	})
}))

describe('QRContents', () => {
	it('renders QR code and remaining time', () => {
		render(<QRContents />, { wrapper: TestWrapper })
		expect(
			screen.getByText('common.unit.seconds', { exact: false })
		).toBeTruthy()
	})
})
