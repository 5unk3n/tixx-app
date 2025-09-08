import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import VenueListItem from '../VenueListItem'

jest.mock('@/hooks/queries/hosts/useIsFollowingHost', () => ({
	useIsFollowingHost: () => ({ data: { isFollowing: false } })
}))
jest.mock('@/hooks/queries/hosts/useToggleHostFollow', () => ({
	useToggleHostFollow: () => ({ mutateAsync: jest.fn() })
}))
jest.mock('@/hooks/useTranslateAddress', () => ({
	useTranslateAddress: () => '주소'
}))

const venue: any = {
	hostId: 10,
	name: '베뉴',
	imageUrl: 'http://example.com/v.jpg',
	host: { imageUrl: 'http://example.com/h.jpg' },
	place: { address: 'a', name: 'n', latitude: '0', longitude: '0' }
}

describe('VenueListItem', () => {
	it('list 타입 렌더 및 팔로우 버튼 표시', () => {
		render(<VenueListItem venue={venue} type="list" showChip />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('베뉴')).toBeTruthy()
	})

	it('card 타입 렌더', () => {
		render(<VenueListItem venue={venue} type="card" />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('베뉴')).toBeTruthy()
	})
})
