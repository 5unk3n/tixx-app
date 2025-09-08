import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import Neutral from '@/assets/illustrations/neutral.svg'
import Smile from '@/assets/illustrations/smile.svg'
import { useReactions } from '@/hooks/queries/events/useReactions'
import { useUpdateReactions } from '@/hooks/queries/events/useUpdateReactions'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import { CustomText } from '../ui/display/CustomText'
import GradientBorderView from '../ui/display/GradientBorderView'

interface EventReactionProps {
	eventId: number
}

export default function EventReaction({ eventId }: EventReactionProps) {
	const { t } = useTranslation()
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
			<CustomText
				variant="headline1Semibold"
				className="text-grayscale-100 mb-2"
			>
				{t('events.reaction.title')}
			</CustomText>
			<CustomText variant="body3Regular" className="text-grayscale-400 mb-6">
				{t('events.reaction.description')}
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
								? [colors.point[500], colors.grayscale[100]]
								: [colors.grayscale[700], colors.grayscale[700]]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<View
							pointerEvents="none"
							className={`py-3 items-center ${
								reactions.userReaction === 1
									? 'bg-point-500/12'
									: 'bg-grayscale-800'
							}`}
						>
							<Smile width={36} height={36} />
							<CustomText
								variant="body2Medium"
								className="text-grayscale-400 mt-2 mb-1"
							>
								{t('events.reaction.like')}
							</CustomText>
							<CustomText variant="body3Regular" className="text-point-500">
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
								? [colors.point[500], colors.grayscale[100]]
								: [colors.grayscale[700], colors.grayscale[700]]
						}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<View
							pointerEvents="none"
							className={`py-3 items-center ${
								reactions.userReaction === 0
									? 'bg-point-500/12'
									: 'bg-grayscale-800'
							}`}
						>
							<Neutral width={36} height={36} />
							<CustomText
								variant="body2Medium"
								className="text-grayscale-400 mt-2 mb-1"
							>
								{t('events.reaction.dislike')}
							</CustomText>
							<CustomText variant="body3Regular" className="text-point-500">
								{`${reactions.reactions[0] || 0}표`}
							</CustomText>
						</View>
					</GradientBorderView>
				</TouchableRipple>
			</View>
		</View>
	)
}
