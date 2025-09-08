import React from 'react'
import { View } from 'react-native'

import DiscoBall from '@/assets/illustrations/disco-ball.svg'

import { CustomText } from '../ui/display/CustomText'

export default function EmptyEvents() {
	return (
		<View className="items-center">
			<DiscoBall />
			<CustomText variant="headline1Medium" className="mt-[30px]">
				Event Comming Soon !
			</CustomText>
			<CustomText variant="body2Medium" className="text-primary mt-2">
				이벤트가 곧 업데이트 됩니다.
			</CustomText>
		</View>
	)
}
