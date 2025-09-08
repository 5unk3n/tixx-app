import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import MainEventCard from '../MainEventCard'

jest.mock('../../ui/display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => (
		<View testID={`icon-${name}`} {...props} />
	)
})

const event = {
	id: 1,
	name: '메인 이벤트',
	imageUrl: 'http://example.com/img.jpg',
	startDate: '2024-01-02',
	eventHashtags: [],
	eventWishes: [],
	tags: [{ tag: 'event' }],
	host: { name: '주최자' }
} as any

describe('MainEventCard', () => {
	it('렌더 및 클릭 가능', () => {
		render(<MainEventCard event={event} />, { wrapper: TestWrapper })
		expect(screen.getByText('메인 이벤트')).toBeTruthy()
	})
})
