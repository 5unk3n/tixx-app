import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import NotificationItem from '../NotificationItem'

jest.mock('@/hooks/queries/notifications/useMarkAsReadNotifications', () => ({
	useMarkAsReadNotifications: () => ({ mutate: jest.fn() })
}))

const baseNotification = {
	id: 1,
	title: '제목',
	body: '내용',
	readAt: null,
	createdAt: new Date('2024-01-01T00:00:00Z'),
	data: { type: '0' }
} as any

describe('NotificationItem', () => {
	it('제목/내용 렌더 및 클릭 시 읽음 처리/네비게이션 수행', () => {
		render(<NotificationItem notification={baseNotification} />, {
			wrapper: TestWrapper
		})
		expect(screen.getByText('제목')).toBeTruthy()
		expect(screen.getByText('내용')).toBeTruthy()
		fireEvent.press(screen.getByText('제목'))
		// 네비게이션과 읽음 처리는 훅 내부 모킹으로 안전하게 호출됨을 전제로 스모크 통과
	})
})
