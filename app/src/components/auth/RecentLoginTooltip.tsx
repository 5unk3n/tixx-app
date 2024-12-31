import React from 'react'
import { View } from 'react-native'

import { UI } from '@/constants/ui'

import { CustomText } from '../ui/display/CustomText'

export default function RecentLoginTooltip() {
	return (
		<View
			className="absolute bg-grayscale-2 h-[30] z-20 rounded-3xl top-[-20] px-4 py-2 self-center -translate-x-11"
			pointerEvents="none"
		>
			<CustomText variant="caption1Medium" className="text-grayscale-w">
				{UI.AUTH.RECENT_LOGIN}
			</CustomText>
			<View className="absolute w-0 h-0 left-6 bottom-[-7] border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-grayscale-2" />
		</View>
	)
}
