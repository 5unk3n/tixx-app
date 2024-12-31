import React from 'react'
import { View } from 'react-native'

import { UI } from '@/constants/ui'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

export default function EmptyTickets() {
	return (
		<View className="flex-1 mb-16 justify-center items-center">
			<View className="rotate-[30deg]">
				<CustomIcon name="ticket" width={81} height={48} />
			</View>
			<CustomText variant="body3Regular" className="text-grayscale-2 mt-10">
				{UI.TICKETS.NOT_EXIST}
			</CustomText>
		</View>
	)
}
