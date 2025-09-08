import { BlurView } from '@react-native-community/blur'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Image, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableRipple } from 'react-native-paper'

import { useEventHashtags } from '@/hooks/useEventHashtags'
import { Events } from '@/types'
import { opacityPercentToHex } from '@/utils/opacityPercentToHex'

import EventWishButton from './EventWishButton'
import BlurredChip from '../ui/display/BlurredChip'
import { CustomText } from '../ui/display/CustomText'
import ShadowGradient from '../ui/display/ShadowGradient'

interface MainEventCardProps {
	event: Events['items'][number]
}

export default function MainEventCard({ event }: MainEventCardProps) {
	const navigation = useNavigation()
	const { t } = useTranslation()
	const { firstHashtag, hasHashtags } = useEventHashtags(event.eventHashtags)

	return (
		<TouchableRipple
			onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
			className="rounded-xl"
			borderless
		>
			<View>
				<Image
					source={{ uri: event.imageUrl }}
					className={`w-full aspect-poster rounded-xl`}
				/>
				<ShadowGradient type={'2'} />
				<View className="absolute top-4 left-4" style={styles.glassMorphShadow}>
					<BlurredChip size="md">
						{format(event.startDate, 'd MMM')}
					</BlurredChip>
				</View>
				<View className="absolute w-full bottom-4 pl-5 pr-4 flex-row items-end justify-between">
					<View className="flex-1 mr-1.5">
						<CustomText
							variant="h1Semibold"
							className="text-[28px] mb-1.5"
							style={styles.textShadow}
							numberOfLines={2}
						>
							{event.name}
						</CustomText>
						<CustomText variant="body1Regular" style={styles.textShadow}>
							{`${event.host.name && event.host.name + ' | '}${
								hasHashtags ? firstHashtag + ' • ' : ''
							}${
								event.tags[0].tag === 'party'
									? t('events.tags.party')
									: event.tags[0].tag === 'event'
										? t('events.tags.event')
										: event.tags[0].tag
							}`}
						</CustomText>
					</View>
					<View style={styles.glassMorphShadow}>
						<View className="h-[37] w-[37] rounded-full overflow-hidden">
							<BlurView
								blurType="light"
								blurAmount={40}
								reducedTransparencyFallbackColor="white"
								style={styles.blurView}
							/>
							<LinearGradient
								colors={[`#ffffff${opacityPercentToHex(40)}`, '#ffffff00']}
								className="h-full w-full justify-center items-center"
							>
								<EventWishButton
									eventId={event.id}
									isWished={event.eventWishes.length > 0}
									size={24}
								/>
							</LinearGradient>
						</View>
					</View>
				</View>
			</View>
		</TouchableRipple>
	)
}

const styles = StyleSheet.create({
	blurView: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	},
	textShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 35,
		elevation: 24
	},
	glassMorphShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 4, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 20
	}
})
