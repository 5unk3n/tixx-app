import React from 'react'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { UI } from '@/constants/ui'
import { useReactions } from '@/hooks/queries/events/useReactions'
import { useUpdateReactions } from '@/hooks/queries/events/useUpdateReactions'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'
import GradientBorderView from '../ui/display/GradientBorderView'

interface EventReactionProps {
	eventId: number
}

export default function EventReaction({ eventId }: EventReactionProps) {
	const { colors } = useCustomTheme()
	const { data: reactions, isPending, isError } = useReactions(eventId)
	const { mutateAsync: updateEventReaction } = useUpdateReactions()

	const handleReaction = (type: 'like' | 'dislike') => {
		if (type === 'like') {
			updateEventReaction({ eventId: eventId, payload: { reactionType: 1 } })
		} else if (type === 'dislike') {
			updateEventReaction({ eventId: eventId, payload: { reactionType: 0 } })
		}
	}

	if (isPending || isError) return

	return (
		<View>
			<CustomText variant="headline1Semibold" className="text-grayscale-8 mb-2">
				{UI.EVENTS.REACTION_TITLE}
			</CustomText>
			<CustomText variant="body3Regular" className="text-grayscale-5 mb-6">
				{UI.EVENTS.REACTION_DESCRIPTION}
			</CustomText>
			<View className="flex-row gap-[10]">
				<TouchableRipple
					onPress={() => handleReaction('like')}
					className="flex-1 rounded-lg "
					borderless
				>
					<GradientBorderView
						borderRadius={8}
						borderWidth={1}
						colors={
							reactions.userReaction === 1
								? [colors.point[3], colors.grayscale[8]]
								: [colors.grayscale[2], colors.grayscale[2]]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<View
							pointerEvents="none"
							className={`py-3 items-center ${
								reactions.userReaction === 1
									? 'bg-point-5a12'
									: 'bg-grayscale-1'
							}`}
						>
							<CustomIcon name="smile" size={36} className="mb-2" />
							<CustomText
								variant="body2Medium"
								className="text-grayscale-5 mb-1"
							>
								{UI.EVENTS.LIKE}
							</CustomText>
							<CustomText variant="body3Regular" className="text-point-3">
								{`${reactions.reactions[1] || 0}표`}
							</CustomText>
						</View>
					</GradientBorderView>
				</TouchableRipple>
				<TouchableRipple
					onPress={() => handleReaction('dislike')}
					className="flex-1 rounded-lg "
					borderless
				>
					<GradientBorderView
						borderRadius={8}
						borderWidth={1}
						colors={
							reactions.userReaction === 0
								? [colors.point[3], colors.grayscale[8]]
								: [colors.grayscale[2], colors.grayscale[2]]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<View
							pointerEvents="none"
							className={`py-3 items-center ${
								reactions.userReaction === 0
									? 'bg-point-5a12'
									: 'bg-grayscale-1'
							}`}
						>
							<CustomIcon name="neutral" size={36} className="mb-2" />
							<CustomText
								variant="body2Medium"
								className="text-grayscale-5 mb-1"
							>
								{UI.EVENTS.DISLIKE}
							</CustomText>
							<CustomText variant="body3Regular" className="text-point-3">
								{`${reactions.reactions[0] || 0}표`}
							</CustomText>
						</View>
					</GradientBorderView>
				</TouchableRipple>
			</View>
		</View>
	)
}
