import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { CustomText } from '../ui/display/CustomText'

export default function RecentLoginTooltip() {
	const { t } = useTranslation()

	return (
		<View
			className="absolute bg-grayscale-700 h-[30] z-20 rounded-3xl top-[-20] px-4 py-2 self-center -translate-x-11"
			pointerEvents="none"
		>
			<CustomText variant="caption1Medium" className="text-grayscale-0">
				{t('auth.lastLogin')}
			</CustomText>
			<View className="absolute w-0 h-0 left-6 bottom-[-7] border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-grayscale-700" />
		</View>
	)
}
