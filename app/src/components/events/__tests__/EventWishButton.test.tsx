import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import EventWishButton from '../EventWishButton'

jest.mock('../../ui/display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => (
		<View testID={`icon-${name}`} {...props} />
	)
})

jest.mock('@/hooks/queries/events/useToggleWish', () => ({
	useToggleWish: () => ({ mutate: jest.fn() })
}))

describe('EventWishButton', () => {
	it('isWished 여부에 따라 아이콘이 달라진다', () => {
		const { rerender } = render(
			<EventWishButton eventId={1} isWished size={20} />,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByTestId('icon-heartFill')).toBeTruthy()
		rerender(<EventWishButton eventId={1} isWished={false} size={20} />)
		expect(screen.getByTestId('icon-heartLine')).toBeTruthy()
	})

	it('클릭 시 토글 훅을 호출한다', () => {
		const mutate = jest.fn()
		jest.mocked(require('@/hooks/queries/events/useToggleWish')).useToggleWish =
			() => ({ mutate }) as any
		render(<EventWishButton eventId={123} isWished={false} />, {
			wrapper: TestWrapper
		})
		fireEvent.press(screen.getByTestId('icon-heartLine'))
		expect(mutate).toHaveBeenCalledWith(123)
	})
})
