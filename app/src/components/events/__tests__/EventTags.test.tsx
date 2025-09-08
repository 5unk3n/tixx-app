import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import EventTags from '../EventTags'

describe('EventTags', () => {
	it('기본 태그 텍스트와 추가 태그를 렌더한다', () => {
		const tags = [
			{ id: 1, tag: 'venue' },
			{ id: 2, tag: 'party' },
			{ id: 3, tag: 'event' },
			{ id: 4, tag: 'etc' }
		] as any
		render(<EventTags tags={tags} additionalTags={['추가']} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('events.tags.venue')).toBeTruthy()
		expect(screen.getByText('events.tags.party')).toBeTruthy()
		expect(screen.getByText('events.tags.event')).toBeTruthy()
		expect(screen.getByText('etc')).toBeTruthy()
		expect(screen.getByText('추가')).toBeTruthy()
	})
})
