import React, { useRef, useState } from 'react'
import { Dimensions, Image, TouchableWithoutFeedback } from 'react-native'
import Animated, {
	Easing,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated'
import Video, { VideoRef } from 'react-native-video'

import { POSTER_RATIO } from '@/constants/dimensions'
import { Event } from '@/types'

const screenWidth = Dimensions.get('window').width

interface EventBackgroundMediaProps {
	event: Event
}

export default function EventBackgroundMedia({
	event
}: EventBackgroundMediaProps) {
	const [isMuted, setIsMuted] = useState(true)
	const isExpanded = useSharedValue(false)

	const backgroundVideoRef = useRef<VideoRef>(null)

	// 배경 이미지 클릭 시 높이 애니메이션
	const toggleImageExpand = () => {
		isExpanded.value = !isExpanded.value
	}

	const video = event.eventMedias?.find((media) =>
		media.mimeType.startsWith('video')
	)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			width: '100%',
			height: withTiming(isExpanded.value ? screenWidth / POSTER_RATIO : 347, {
				duration: 300,
				easing: Easing.bezier(0.25, 0.1, 0.25, 1)
			})
		}
	})

	useAnimatedReaction(
		() => isExpanded.value,
		(currentValue) => {
			if (currentValue === true) {
				runOnJS(setIsMuted)(false)
			} else {
				runOnJS(setIsMuted)(true)
			}
		}
	)

	return (
		<Animated.View style={animatedStyle} testID="animated-view">
			<TouchableWithoutFeedback onPress={toggleImageExpand}>
				{video ? (
					<Video
						source={{
							uri: video.mediaUrl
						}}
						repeat={true}
						resizeMode="cover"
						ref={backgroundVideoRef}
						muted={isMuted}
						volume={0.5}
						className="h-full"
					/>
				) : (
					<Image source={{ uri: event.imageUrl }} className="h-full" />
				)}
			</TouchableWithoutFeedback>
		</Animated.View>
	)
}
