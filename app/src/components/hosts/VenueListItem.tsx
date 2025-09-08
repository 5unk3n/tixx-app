import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, Image } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { useIsFollowingHost } from '@/hooks/queries/hosts/useIsFollowingHost'
import { useToggleHostFollow } from '@/hooks/queries/hosts/useToggleHostFollow'
import { useTranslateAddress } from '@/hooks/useTranslateAddress'
import { VenuesResponse } from '@/types'

import BlurredChip from '../ui/display/BlurredChip'
import { CustomText } from '../ui/display/CustomText'
import ShadowGradient from '../ui/display/ShadowGradient'

interface VenueListItemProps {
	venue: VenuesResponse['items'][number]
	type: 'list' | 'card'
	showChip?: boolean
	onPress?: () => void
}

export default function VenueListItem({
	venue,
	type,
	showChip = false,
	onPress
}: VenueListItemProps) {
	const navigation = useNavigation()
	const { t } = useTranslation()
	const address = useTranslateAddress({
		address: venue.place.address,
		name: venue.place.name,
		latitude: venue.place.latitude,
		longitude: venue.place.longitude
	})

	const { data: isFollowing } = useIsFollowingHost(venue.hostId)
	const { mutateAsync: toggleHostFollow } = useToggleHostFollow()

	const handlePress = () => {
		if (onPress) {
			onPress()
		}
		navigation.navigate('HostDetail', { hostId: venue.hostId })
	}

	return (
		<TouchableRipple
			onPress={handlePress}
			className={type === 'list' ? '' : 'rounded-lg'}
			borderless
		>
			{type === 'list' ? (
				<View className="flex-row items-center">
					<View>
						<Image
							source={{ uri: venue.host.imageUrl }}
							width={84}
							height={84}
							className="rounded-lg"
						/>
						{showChip && (
							<>
								<ShadowGradient type={'main'} />
								<View
									className={`absolute bottom-2 left-2`}
									style={styles.glassMorphShadow}
								>
									<BlurredChip size="sm">{t('events.tags.venue')}</BlurredChip>
								</View>
							</>
						)}
					</View>
					<View className="flex-1 ml-4">
						<CustomText variant="body3Medium">{venue.name}</CustomText>
						<CustomText
							variant="caption1Medium"
							className="mt-1.5 text-grayscale-400"
							numberOfLines={2}
						>
							{address}
						</CustomText>
					</View>
					<TouchableRipple
						onPress={() => toggleHostFollow(venue.hostId)}
						className={`ml-2 rounded-lg py-[5px] px-3 ${
							isFollowing?.isFollowing ? 'bg-grayscale-500' : 'bg-grayscale-100'
						}`}
						borderless
					>
						<CustomText
							variant="body3Medium"
							className={
								isFollowing?.isFollowing
									? 'text-grayscale-0'
									: 'text-grayscale-900'
							}
						>
							{isFollowing?.isFollowing
								? t('common.following')
								: t('common.follow')}
						</CustomText>
					</TouchableRipple>
				</View>
			) : (
				<View className="w-[227px] h-[133px]">
					<Image
						source={{ uri: venue.imageUrl }}
						width={227}
						height={133}
						className="rounded-lg "
					/>
					<ShadowGradient type={'main'} />
					<View className="absolute bottom-4 flex-row items-center justify-between w-full px-4">
						<CustomText
							variant="headline1Medium"
							numberOfLines={1}
							className="mr-2 shrink"
						>
							{venue.name}
						</CustomText>
						<TouchableRipple
							onPress={() => toggleHostFollow(venue.hostId)}
							className={`rounded-lg py-[5px] px-3 ${
								isFollowing?.isFollowing
									? 'bg-grayscale-500'
									: 'bg-grayscale-100'
							}`}
							borderless
						>
							<CustomText
								variant="body3Medium"
								className={
									isFollowing?.isFollowing
										? 'text-grayscale-0'
										: 'text-grayscale-900'
								}
							>
								{isFollowing?.isFollowing
									? t('common.following')
									: t('common.follow')}
							</CustomText>
						</TouchableRipple>
					</View>
				</View>
			)}
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
	glassMorphShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 20
	}
})
