import { describe, it, expect, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import {
	StaticHeader,
	NearbyEventsHeader,
	HostFollowersHeader,
	MyFollowingsHeader,
	CheckProfileHeader,
	VerifyIdentityHeader
} from '../StackHeader'

// Mock react-navigation hooks used by the child CustomHeader
jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({}),
	useRoute: () => ({ name: 'MockedScreen', params: {} }),
	useFocusEffect: jest.fn()
}))

describe('StackHeader', () => {
	const mockProps = {
		options: { title: '테스트 타이틀' }
	} as any

	const testCases = [
		{ name: 'StaticHeader', component: StaticHeader },
		{ name: 'NearbyEventsHeader', component: NearbyEventsHeader },
		{ name: 'HostFollowersHeader', component: HostFollowersHeader },
		{ name: 'MyFollowingsHeader', component: MyFollowingsHeader },
		{ name: 'CheckProfileHeader', component: CheckProfileHeader },
		{ name: 'VerifyIdentityHeader', component: VerifyIdentityHeader }
	]

	testCases.forEach(({ name, component: HeaderComponent }) => {
		it(`should render ${name} correctly`, () => {
			const { toJSON } = render(<HeaderComponent {...mockProps} />, {
				wrapper: TestWrapper
			})
			expect(toJSON()).toMatchSnapshot()
		})
	})
})
