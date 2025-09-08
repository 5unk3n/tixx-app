import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Image } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { useQRCode } from '@/hooks/queries/users/useQRCode'

import { CustomText } from '../ui/display/CustomText'

export default function QRContents() {
	const { t } = useTranslation()
	const { QRCode, remainingTime, isFetching } = useQRCode()

	return (
		<View>
			<View className="w-full aspect-square mb-[34] mx-auto rounded-xl overflow-hidden bg-white">
				<Image source={{ uri: QRCode?.imgUrl }} className="w-full h-full" />
				{isFetching && (
					<View className="absolute w-full h-full items-center justify-center bg-white">
						<ActivityIndicator />
					</View>
				)}
			</View>
			<CustomText variant="body1Medium" className="text-primary text-center">
				{t('common.unit.seconds', { value: remainingTime })}
			</CustomText>
		</View>
	)
}
