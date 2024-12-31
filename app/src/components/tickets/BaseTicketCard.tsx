import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, CardProps } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'
import { EventTicket } from '@/types'
import { formatTicketDate, formatTicketTime } from '@/utils/formatters'

import EventTags from '../events/EventTags'
import { CustomText } from '../ui/display/CustomText'
import GradientText from '../ui/display/GradientText'

interface BaseTicketCardProps {
	eventTicket: Omit<EventTicket, 'transfers'>
	onLayout?: CardProps['onLayout']
}

export default function BaseTicketCard({
	eventTicket,
	onLayout
}: BaseTicketCardProps) {
	const { colors } = useCustomTheme()

	return (
		<Card onLayout={onLayout}>
			<Card.Cover
				style={styles.cardCover}
				source={{ uri: eventTicket.event.imageUrl }}
			/>
			<Card.Content className="pt-4 px-5 pb-6 bg-surfaceVariant rounded-b-xl border-[1px] border-t-0 border-grayscale-2">
				<EventTags
					tags={eventTicket.event.tags}
					className="absolute left-5 -top-10"
				/>
				<CustomText variant="h1Semibold" numberOfLines={1} className="mb-5">
					{eventTicket.event.name}
				</CustomText>
				<View className="flex-row justify-between items-center">
					<GradientText
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						colors={[colors.point[3], colors.point[5]]}
						className="font-semibold text-[40px] leading-10 tracking-tight"
						containerStyle={styles.gradientTextContainer}
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{/* HACK: 임시로 VIP 하드코딩  */}
						{'VIP'}
					</GradientText>
					<View className="gap-2">
						<CustomText
							variant="body2Medium"
							className="text-right text-grayscale-5"
						>
							{formatTicketDate(eventTicket.startAt)}
						</CustomText>
						<CustomText
							variant="body2Medium"
							className="text-right text-grayscale-5"
						>
							{formatTicketTime(eventTicket.startAt, eventTicket.endAt)}
						</CustomText>
					</View>
				</View>
			</Card.Content>
		</Card>
	)
}

const styles = StyleSheet.create({
	cardCover: {
		width: '100%',
		height: 'auto',
		aspectRatio: '350/364',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0
	},
	gradientTextContainer: {
		flexShrink: 1
	}
})
