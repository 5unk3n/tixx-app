import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Ticket from '@/assets/illustrations/ticket.svg'

import { CustomText } from '../ui/display/CustomText'

export default function EmptyTickets() {
	const { t } = useTranslation()

	return (
		<View className="flex-1 mb-16 justify-center items-center">
			<View className="rotate-[30deg]">
				<Ticket width={81} height={48} />
			</View>
			<CustomText variant="body3Regular" className="text-grayscale-700 mt-10">
				{t('tickets.empty')}
			</CustomText>
		</View>
	)
}
