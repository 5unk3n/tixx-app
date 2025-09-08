import {
	describe,
	it,
	expect,
	jest,
	beforeEach,
	afterEach
} from '@jest/globals'
import { fireEvent, render, screen, act } from '@testing-library/react-native'
import React, { Ref } from 'react'
import { Dimensions, View, ViewProps } from 'react-native'
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated'
import {} from 'react-native-reanimated'

import { Event } from '@/types'

import EventBackgroundMedia from '../EventBackgroundMedia'

// --- Mocks ---

jest.mock('react-native-reanimated', () => ({
	__esModule: true,
	...(jest.requireActual(
		'react-native-reanimated'
	) as typeof import('react-native-reanimated')),
	useSharedValue: jest.fn(),
	useAnimatedStyle: jest.fn((callback: () => void) => callback()),
	useAnimatedReaction: jest.fn(),
	withTiming: (value: any) => value,
	Easing: {
		bezier: jest.fn()
	},
	runOnJS: (fn: () => void) => fn
}))

const mockedUseSharedValue = useSharedValue as jest.Mock
const mockedUseAnimatedReaction = useAnimatedReaction as jest.Mocked<
	typeof useAnimatedReaction
>

jest.mock('react-native-video', () => {
	const React = require('react')
	const { View } = require('react-native')

	const MockVideo = React.forwardRef((props: ViewProps, ref: Ref<View>) => (
		<View {...props} testID="video-mock" ref={ref} />
	))

	MockVideo.displayName = 'MockVideo'

	return {
		__esModule: true,
		default: MockVideo
	}
})

Dimensions.get = jest.fn<any>().mockReturnValue({ width: 400 })

// --- Mock Data ---

// @ts-ignore
const mockEventWithImage = {
	id: 1,
	title: 'Test Event with Image',
	imageUrl: 'https://example.com/image.png',
	eventMedias: []
} as Event

// @ts-ignore
const mockEventWithVideo = {
	id: 2,
	title: 'Test Event with Video',
	imageUrl: 'https://example.com/image.png',
	eventMedias: [
		{
			id: 1,
			mediaUrl: 'https://example.com/video.mp4',
			mimeType: 'video/mp4',
			isFeatured: true
		}
	]
} as Event

describe('EventBackgroundMedia', () => {
	let isExpanded: boolean

	beforeEach(() => {
		isExpanded = false
		mockedUseSharedValue.mockReturnValue(isExpanded)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('when event has no video', () => {
		it('renders an Image component', () => {
			render(<EventBackgroundMedia event={mockEventWithImage} />)
			expect(screen.queryByTestId('video-mock')).toBeNull()
		})

		it('toggles expand value on press', () => {
			render(<EventBackgroundMedia event={mockEventWithImage} />)
			const touchable = screen.getByTestId('animated-view')

			expect(isExpanded).toBe(false)

			act(() => {
				fireEvent.press(touchable)
				isExpanded = !isExpanded
			})
			expect(isExpanded).toBe(true)

			act(() => {
				fireEvent.press(touchable)
				isExpanded = !isExpanded
			})
			expect(isExpanded).toBe(false)
		})
	})

	describe('when event has a video', () => {
		it('renders a Video component', () => {
			render(<EventBackgroundMedia event={mockEventWithVideo} />)
			expect(screen.getByTestId('video-mock')).toBeTruthy()
		})

		it('toggles muted state on press', () => {
			let reactionCallback: Function
			mockedUseAnimatedReaction.mockImplementation((_dependency, callback) => {
				reactionCallback = callback
			})

			const { rerender } = render(
				<EventBackgroundMedia event={mockEventWithVideo} />
			)
			const touchable = screen.getByTestId('animated-view')

			// 초기 상태: muted
			expect(screen.getByTestId('video-mock').props.muted).toBe(true)

			// 확장
			act(() => {
				fireEvent.press(touchable)
				isExpanded = true
				reactionCallback(isExpanded, !isExpanded)
			})

			rerender(<EventBackgroundMedia event={mockEventWithVideo} />)
			expect(screen.getByTestId('video-mock').props.muted).toBe(false)

			// 축소
			act(() => {
				fireEvent.press(touchable)
				isExpanded = false
				reactionCallback(isExpanded, !isExpanded)
			})

			rerender(<EventBackgroundMedia event={mockEventWithVideo} />)
			expect(screen.getByTestId('video-mock').props.muted).toBe(true)
		})
	})
})
