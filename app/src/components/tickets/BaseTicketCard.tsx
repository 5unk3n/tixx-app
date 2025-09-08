import { BlurView } from '@react-native-community/blur'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Card, CardProps } from 'react-native-paper'

import { POSTER_RATIO } from '@/constants/dimensions'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { Event, Ticket } from '@/types'
import {
	formatDateWithDay,
	formatDDay,
	formatTimeRange
} from '@/utils/formatters'

import EventTags from '../events/EventTags'
import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'
import GradientText from '../ui/display/GradientText'

interface BaseTicketCardProps {
	ticket: Omit<Ticket, 'event'>
	event: Omit<Event, 'place'>
	onLayout?: CardProps['onLayout']
}

export default function BaseTicketCard({
	ticket,
	event,
	onLayout
}: BaseTicketCardProps) {
	const { t, i18n } = useTranslation()
	const { colors } = useCustomTheme()

	// FIXME: name이 아니라 type으로 처리해야함. 어떻게 보여줄지는 추후 논의
	const getTicketName = () => {
		if (ticket.name === 'Standard') {
			if (ticket.type === 'Standard') {
				return ' '
			}
			return ticket.type
		}
		return ticket.name
	}

	return (
		<Card onLayout={onLayout}>
			<Card.Cover style={styles.cardCover} source={{ uri: event.imageUrl }} />
			<Card.Content className="pt-4 px-5 pb-6 bg-grayscale-900 rounded-b-xl border-[1px] border-t-0 border-grayscale-700">
				<View className="absolute flex-row -top-10 left-5">
					<View className="flex-1">
						<EventTags
							tags={event.tags}
							additionalTags={[formatDDay(ticket.startAt)]}
						/>
					</View>
					<View style={styles.glassMorphShadow}>
						<View className="h-8 w-8 rounded-full overflow-hidden border-[0.5px] border-grayscale-100">
							<BlurView
								blurType={'light'}
								blurAmount={48}
								reducedTransparencyFallbackColor="white"
								style={styles.blurView}
							/>
							<LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 0, y: 1 }}
								colors={['#ffffff40', '#ffffff00']}
								className={`h-full w-full justify-center items-center`}
							>
								<CustomIcon name="northEast" size={20} className="text-white" />
							</LinearGradient>
						</View>
					</View>
				</View>
				<CustomText variant="h1Semibold" numberOfLines={1} className="mb-5">
					{event.name}
				</CustomText>
				<View className="flex-row justify-between items-center">
					<GradientText
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						colors={[colors.point[500], colors.point[900]]}
						className="mr-3 font-semibold text-[40px] leading-10 tracking-tight"
						containerStyle={styles.gradientTextContainer}
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{getTicketName()}
					</GradientText>
					<View className="gap-2">
						<CustomText
							variant="body2Medium"
							className="text-right text-grayscale-400"
						>
							{formatDateWithDay(ticket.startAt, i18n.language)}
						</CustomText>
						<CustomText
							variant="body2Medium"
							className="text-right text-grayscale-400"
						>
							{t(
								'tickets.entryTime',
								formatTimeRange(ticket.startAt, ticket.endAt)
							)}
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
		aspectRatio: POSTER_RATIO,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0
	},
	gradientTextContainer: {
		flexShrink: 1
	},
	glassMorphShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 4, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 20
	},
	blurView: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	}
})
