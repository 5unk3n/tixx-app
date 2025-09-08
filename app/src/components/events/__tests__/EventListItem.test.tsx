import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import EventListItem from '../EventListItem'

jest.mock('../../ui/display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => (
		<View testID={`icon-${name}`} {...props} />
	)
})

jest.mock('@/hooks/useEventHashtags', () => ({
	useEventHashtags: () => ({ hasHashtags: true, firstHashtag: 'hash' })
}))
jest.mock('@/hooks/useTranslateAddress', () => ({
	useTranslateAddress: () => '주소'
}))

const baseEvent = {
	id: 1,
	name: '이벤트명',
	imageUrl: 'http://example.com/img.jpg',
	startDate: '2024-01-01',
	startTime: '10:00:00',
	endDate: '2024-01-01',
	endTime: '12:00:00',
	eventHashtags: [],
	eventWishes: [],
	tags: [{ tag: 'event' }],
	host: { name: '주최자' },
	place: { address: 'a', name: 'n', latitude: '0', longitude: '0' }
} as any

describe('EventListItem', () => {
	it('list/md 렌더 및 클릭 시 navigate 호출', () => {
		const onPress = jest.fn()
		render(
			<EventListItem
				event={baseEvent}
				type="list"
				size="md"
				onPress={onPress}
			/>,
			{ wrapper: TestWrapper }
		)
		fireEvent.press(screen.getByText('이벤트명'))
		expect(onPress).toHaveBeenCalled()
	})

	it('card/sm 렌더', () => {
		render(<EventListItem event={baseEvent} type="card" size="sm" />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('이벤트명')).toBeTruthy()
	})
})
