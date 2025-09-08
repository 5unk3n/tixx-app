import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import EventInfo from '../EventInfo'

jest.mock('../../maps/StaticMap', () => {
	const { View } = require('react-native')
	return (props: any) => <View testID="static-map" {...props} />
})

jest.mock('../../ui/display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => (
		<View testID={`icon-${name}`} {...props} />
	)
})

jest.mock('@/hooks/useTranslateAddress', () => ({
	useTranslateAddress: () => '주소'
}))

const baseEvent: any = {
	id: 1,
	name: '이벤트',
	memo: '메모',
	startDate: '2024-01-01',
	startTime: '10:00:00',
	endDate: '2024-01-01',
	endTime: '12:00:00',
	place: { address: 'a', name: 'n', latitude: '0', longitude: '0' },
	host: { id: 99, imageUrl: 'x', name: '주최자' }
}

describe('EventInfo', () => {
	it('default 모드에서 날짜/시간/장소/제공 정보가 렌더된다', () => {
		render(<EventInfo event={baseEvent} />, { wrapper: TestWrapper })
		expect(screen.getByTestId('icon-calendar')).toBeTruthy()
		expect(screen.getByTestId('icon-time')).toBeTruthy()
		expect(screen.getByTestId('icon-place')).toBeTruthy()
		expect(screen.getByTestId('icon-pin')).toBeTruthy()
	})

	it('detail 모드에서 StaticMap 및 venue 섹션이 렌더된다', () => {
		render(
			<EventInfo
				event={baseEvent}
				mode="detail"
				venue={{ name: '장소', host: { id: 1 } } as any}
			/>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByTestId('static-map')).toBeTruthy()
		expect(screen.getByText('장소')).toBeTruthy()
	})
})
