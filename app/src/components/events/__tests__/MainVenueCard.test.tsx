import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { useToggleHostFollow } from '@/hooks/queries/hosts/useToggleHostFollow'

import { TestWrapper } from '../../testUtils/TestWrapper'
import MainVenueCard from '../MainVenueCard'

jest.mock('@/hooks/queries/hosts/useIsFollowingHost', () => ({
	useIsFollowingHost: () => ({ data: { isFollowing: false } })
}))
jest.mock('@/hooks/queries/hosts/useToggleHostFollow')
jest.mock('@/hooks/useTranslateAddress', () => ({
	useTranslateAddress: () => 'Translated Address'
}))

const venue = {
	id: 1,
	name: 'Test Venue',
	imageUrl: 'http://example.com/image.png',
	hostId: 1,
	place: {
		address: 'address',
		name: 'name',
		latitude: '0',
		longitude: '0'
	}
} as any

const mockedUseToggleHostFollow = useToggleHostFollow as jest.Mock

describe('MainVenueCard', () => {
	it('renders venue information and handles follow button press', () => {
		const toggleHostFollow = jest.fn()
		mockedUseToggleHostFollow.mockReturnValue({ mutateAsync: toggleHostFollow })

		render(<MainVenueCard venue={venue} />, { wrapper: TestWrapper })

		expect(screen.getByText('Test Venue')).toBeTruthy()
		expect(screen.getByText('Translated Address')).toBeTruthy()

		const followButton = screen.getByText('common.follow')
		expect(followButton).toBeTruthy()
		fireEvent.press(followButton)
		expect(toggleHostFollow).toHaveBeenCalledWith(1)
	})
})
