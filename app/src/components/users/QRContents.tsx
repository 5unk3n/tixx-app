import React from 'react'
import { View, Image } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { UI } from '@/constants/ui'
import { useQRCode } from '@/hooks/queries/users/useQRCode'

import { CustomText } from '../ui/display/CustomText'

export default function QRContents() {
	const { QRCode, remainingTime, isFetching } = useQRCode()

	return (
		<View>
			<View className="w-56 h-56 mb-9 mx-auto rounded-xl overflow-hidden bg-white">
				<Image source={{ uri: QRCode?.imgUrl }} className="w-full h-full" />
				{isFetching && (
					<View className="absolute w-full h-full items-center justify-center bg-grayscale-b/60">
						<ActivityIndicator />
					</View>
				)}
			</View>
			<CustomText variant="body1Medium" className="text-primary text-center">
				{`${remainingTime}${UI.COMMON.SECONDS}`}
			</CustomText>
		</View>
	)
}
