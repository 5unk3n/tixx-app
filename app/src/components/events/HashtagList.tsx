import React from 'react'
import { View } from 'react-native'

import { CustomText } from '../ui/display/CustomText'

interface HashtagListProps {
	hashtags: string[]
	onPress?: (hashtag: string) => void
}

export default function HashtagList({ hashtags, onPress }: HashtagListProps) {
	const handlePress = (hashtag: string) => {
		if (onPress) {
			onPress(hashtag)
		}
	}

	return (
		<View className="flex-row gap-2 flex-wrap">
			{hashtags.map((hashtag) => (
				<View
					key={hashtag}
					className="bg-grayscale-800 rounded-[20px] px-[11px] py-[3px]"
				>
					<CustomText
						key={hashtag}
						variant="body3Regular"
						onPress={() => handlePress(hashtag)}
						className="text-grayscale-300 "
					>{`#${hashtag}`}</CustomText>
				</View>
			))}
		</View>
	)
}
