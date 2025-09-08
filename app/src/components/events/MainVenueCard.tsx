import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Image, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { useIsFollowingHost } from '@/hooks/queries/hosts/useIsFollowingHost'
import { useToggleHostFollow } from '@/hooks/queries/hosts/useToggleHostFollow'
import { useTranslateAddress } from '@/hooks/useTranslateAddress'
import { Events } from '@/types'

import { CustomText } from '../ui/display/CustomText'
import ShadowGradient from '../ui/display/ShadowGradient'

interface MainVenueCardProps {
	venue: Events['items'][number]
}

export default function MainVenueCard({ venue }: MainVenueCardProps) {
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

	return (
		<TouchableRipple
			onPress={() =>
				navigation.navigate('HostDetail', { hostId: venue.hostId })
			}
			className="rounded-xl"
			borderless
		>
			<View>
				<Image
					source={{ uri: venue.imageUrl }}
					className={`w-full aspect-poster rounded-xl border border-grayscale-700`}
				/>
				<ShadowGradient type={'2'} />
				<View className="absolute w-full bottom-4 pl-5 pr-4 flex-row items-end justify-between">
					<View className="flex-1 mr-1.5">
						<CustomText
							variant="h1Semibold"
							className="text-[28px] mb-1.5"
							style={styles.textShadow}
							numberOfLines={2}
						>
							{venue.name}
						</CustomText>
						<CustomText
							variant="body1Regular"
							style={styles.textShadow}
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
			</View>
		</TouchableRipple>
	)
}

const styles = StyleSheet.create({
	textShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 35,
		elevation: 24
	}
})
