import { useNavigation } from '@react-navigation/native'
import { format, parseISO } from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Image, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { useEventHashtags } from '@/hooks/useEventHashtags'
import { useTranslateAddress } from '@/hooks/useTranslateAddress'
import { Events } from '@/types'

import EventWishButton from './EventWishButton'
import BlurredChip from '../ui/display/BlurredChip'
import { CustomText } from '../ui/display/CustomText'
import ShadowGradient from '../ui/display/ShadowGradient'

interface EventListItemProps {
	event: Events['items'][number]
	type: 'list' | 'card'
	size?: 'lg' | 'md' | 'sm'
	onPress?: () => void
}

export default function EventListItem({
	event,
	type,
	size = 'md',
	onPress
}: EventListItemProps) {
	const navigation = useNavigation()
	const { t, i18n } = useTranslation()

	const { hasHashtags, firstHashtag } = useEventHashtags(event.eventHashtags)
	const address = useTranslateAddress({
		address: event.place.address,
		name: event.place.name,
		latitude: event.place.latitude,
		longitude: event.place.longitude
	})

	const startDateTimeUTC = parseISO(`${event.startDate}T${event.startTime}Z`)

	if (size === 'lg' && type !== 'list') {
		throw new Error(
			`size="lg" is only available for type="list"\ncurrent: type="${type}" size="${size}"`
		)
	}

	const handlePress = () => {
		if (onPress) {
			onPress()
		}
		navigation.navigate('EventDetail', { eventId: event.id })
	}

	return (
		<TouchableRipple onPress={handlePress}>
			{type === 'list' ? (
				<View
					className={
						size === 'sm' ? 'flex-row' : 'flex-row rounded-lg overflow-hidden'
					}
				>
					<View>
						<Image
							source={{ uri: event.imageUrl }}
							className={
								size === 'sm'
									? `w-[90px] aspect-poster rounded-lg`
									: size === 'md'
										? `w-[84px] aspect-poster rounded-lg`
										: `w-[175px] aspect-poster rounded-lg`
							}
						/>
						<ShadowGradient type={size === 'lg' ? '2-2' : '1'} />
						<View
							className={`absolute ${size === 'lg' ? 'left-2 top-2' : 'bottom-2 left-2'}`}
							style={styles.glassMorphShadow}
						>
							<BlurredChip size="sm">
								{event.tags[0].tag === 'venue'
									? t('events.tags.venue')
									: event.tags[0].tag === 'party'
										? t('events.tags.party')
										: event.tags[0].tag === 'event'
											? t('events.tags.event')
											: event.tags[0].tag}
							</BlurredChip>
						</View>
						{size === 'lg' && (
							<EventWishButton
								eventId={event.id}
								isWished={event.eventWishes?.length > 0}
								className="absolute right-1 bottom-1"
							/>
						)}
					</View>
					<View className={'flex-1 flex-row ml-4 items-center'}>
						<View className={`flex-1 ${size === 'sm' ? 'gap-1.5' : 'gap-2'}`}>
							{size === 'lg' && (
								<CustomText
									variant="body1Medium"
									className={'text-primary mb-4'}
								>
									{format(startDateTimeUTC, 'yyyy.MM.dd (E)', {
										locale: i18n.language === 'ko' ? ko : enUS
									})}
								</CustomText>
							)}
							<CustomText variant="body1Medium" numberOfLines={2}>
								{event.name}
							</CustomText>
							{(size === 'sm' || size === 'md') && (
								<CustomText
									variant="body3Regular"
									className={
										size === 'sm' ? 'text-primary' : 'text-grayscale-300'
									}
								>
									{format(startDateTimeUTC, 'yyyy.MM.dd')}
								</CustomText>
							)}
							{size === 'lg' && (
								<CustomText
									variant="body3Regular"
									className="text-grayscale-300"
									numberOfLines={1}
								>
									{address}
								</CustomText>
							)}
							<CustomText
								variant="body3Regular"
								className={
									size === 'lg' ? 'text-grayscale-0' : 'text-grayscale-300'
								}
							>
								{event.host.name}
							</CustomText>
							{size === 'md' && hasHashtags && (
								<View className="h-6 border border-grayscale-700 rounded-[20px] justify-center px-1.5 self-start">
									<CustomText
										variant="body3Regular"
										className="text-grayscale-300"
									>{`#${firstHashtag}`}</CustomText>
								</View>
							)}
						</View>
						{size !== 'lg' && (
							<EventWishButton
								eventId={event.id}
								isWished={event.eventWishes?.length > 0}
							/>
						)}
					</View>
				</View>
			) : (
				<View
					className={`rounded-lg ${
						size === 'sm'
							? 'w-[161]'
							: 'w-[300px] border border-grayscale-700 overflow-hidden'
					}`}
				>
					<View className={size === 'sm' ? '' : 'mt-4 mx-4'}>
						<Image
							source={{ uri: event.imageUrl }}
							className={`aspect-poster rounded-lg ${
								size === 'sm' ? 'w-[161] rounded-b-none' : 'w-[266]'
							}`}
						/>
						<ShadowGradient type={'2'} />
						<View
							className={`absolute ${size === 'sm' ? 'top-2 left-2' : 'top-4 left-4'}`}
							style={styles.glassMorphShadow}
						>
							<BlurredChip size="sm">
								{event.tags[0].tag === 'venue'
									? t('events.tags.venue')
									: event.tags[0].tag === 'party'
										? t('events.tags.party')
										: event.tags[0].tag === 'event'
											? t('events.tags.event')
											: event.tags[0].tag}
							</BlurredChip>
						</View>
						<View className="absolute bottom-2 right-2">
							<EventWishButton
								eventId={event.id}
								isWished={event.eventWishes?.length > 0}
							/>
						</View>
					</View>
					<View
						className={`rounded-b-lg border-grayscale-700 ${
							size === 'sm' ? 'p-2 pb-3 border border-t-0' : 'p-4 pt-[14px]'
						}`}
					>
						<View>
							<CustomText
								variant={size === 'sm' ? 'body1Medium' : 'headline1Semibold'}
								numberOfLines={2}
								className={size === 'sm' ? 'h-9' : 'h-12 leading-6'}
							>
								{event.name}
							</CustomText>
							<View
								className={`justify-between items-center flex-row ${size === 'sm' ? 'mt-[5px]' : 'mt-3'}`}
							>
								{/* HACK: 이름 없는 호스트 있는 동안 유지 */}
								{event.host.name && (
									<CustomText
										variant={size === 'sm' ? 'body3Regular' : 'body1Regular'}
										className="flex-1 text-grayscale-300"
										numberOfLines={1}
									>
										{event.host.name}
									</CustomText>
								)}
								<CustomText
									variant={size === 'sm' ? 'body3Regular' : 'body3Regular'}
									className={'text-grayscale-300'}
								>
									{format(startDateTimeUTC, 'yyyy.MM.dd')}
								</CustomText>
							</View>
						</View>
					</View>
				</View>
			)}
		</TouchableRipple>
	)
}

const styles = StyleSheet.create({
	glassMorphShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 4, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 4
	}
})
