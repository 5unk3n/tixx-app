import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Card } from 'react-native-paper'

import { UI } from '@/constants/ui'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { EventTicket } from '@/types'

import EventInfo from '../events/EventInfo'
import EventTags from '../events/EventTags'
import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'

interface TicketCardDetailOverlayProps {
	eventTicket: Omit<EventTicket, 'transfers'>
	actions?: React.ReactNode
}

export default function TicketCardDetailOverlay({
	eventTicket,
	actions
}: TicketCardDetailOverlayProps) {
	const { colors } = useCustomTheme()
	const navigation = useNavigation()

	return (
		<View className="absolute w-full h-full">
			<Card.Content className="flex-1 rounded-xl p-0 overflow-hidden">
				<LinearGradient
					className="flex-1 px-5 pb-4"
					colors={['transparent', colors.grayscale[1], colors.grayscale[1]]}
				>
					<View className="mt-auto ">
						<EventTags tags={eventTicket.event.tags} className="mb-2" />
						<CustomText variant="h1Semibold">
							{eventTicket.event.name}
						</CustomText>
						<CustomButton
							mode="text"
							size="sm"
							labelVariant="body3Regular"
							className="-ml-3"
							labelStyle={{ color: colors.grayscale[5] }}
							onPress={() =>
								navigation.navigate('EventDetail', eventTicket.event)
							}
						>
							{UI.TICKETS.VIEW_DETAIL}
						</CustomButton>
					</View>
					<View className="mt-4 mb-10">
						<EventInfo event={eventTicket.event} />
					</View>
					{actions}
				</LinearGradient>
			</Card.Content>
		</View>
	)
}
