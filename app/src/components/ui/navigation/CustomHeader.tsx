import {
	RouteProp,
	useFocusEffect,
	useNavigation,
	useRoute
} from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Appbar, Badge, TouchableRipple } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import TixxSymbol from '@/assets/illustrations/tixx-symbol.svg'
import { useHost } from '@/hooks/queries/hosts/useHost'
import { useIsFollowingHost } from '@/hooks/queries/hosts/useIsFollowingHost'
import { useToggleHostFollow } from '@/hooks/queries/hosts/useToggleHostFollow'
import { useNotificationsUnread } from '@/hooks/queries/notifications/useNotificationsUnread'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { useShareLink } from '@/hooks/useShareLink'
import { useHomeTabStore } from '@/stores/homeTabStore'
import { MainStackParamList } from '@/types/navigation'
import { queryClient } from '@/utils/queryClient'

import CustomIcon from '../display/CustomIcon'
import { CustomText } from '../display/CustomText'
import CustomButton from '../input/CustomButton'

interface CustomHeaderProps {
	title?: string
	titleType?: 'md' | 'lg'
	hasLogo?: boolean
	hasBack?: boolean
	hasEdit?: boolean
	hasCalendar?: boolean
	hasNotification?: boolean
	hasSettings?: boolean
	hasProfileEdit?: boolean
	hasAddTicket?: boolean
	hasHostActions?: boolean
	hasMap?: boolean
	isBgTransparent?: boolean
}

export default function CustomHeader({
	title,
	titleType = 'md',
	hasLogo,
	hasBack,
	hasEdit,
	hasCalendar,
	hasNotification,
	hasSettings,
	hasProfileEdit,
	hasAddTicket,
	hasHostActions,
	hasMap,
	isBgTransparent
}: CustomHeaderProps) {
	const navigation = useNavigation()
	const { t } = useTranslation()

	const handleCalendarPress = () => {
		Toast.show({
			type: 'error',
			text1: 'Calendar'
		})
	}

	const { setCurrentTab } = useHomeTabStore()

	return (
		<Appbar.Header
			className={`flex-row h-14 px-0 ${isBgTransparent ? 'bg-transparent' : undefined}`}
			statusBarHeight={0}
		>
			<View className="flex-row items-center ml-5">
				{hasBack && (
					<Appbar.Action
						className="mr-[5] -ml-[3]"
						icon={BackIcon}
						animated={false}
						onPress={navigation.goBack}
					/>
				)}
				{title && (
					<Appbar.Content
						title={
							hasEdit ? (
								<TouchableRipple
									onPress={() =>
										navigation.navigate('Profile', { mode: 'view' })
									}
									className="mr-auto"
								>
									<View className="flex-row items-center">
										<CustomText
											className={`${titleType === 'lg' && 'text-grayscale-400 ml-[6] bg-red-200'}`}
											variant={`${titleType === 'md' ? 'headline1Semibold' : 'h1Semibold'}`}
											numberOfLines={1}
										>
											{title}
										</CustomText>
										<CustomIcon name="arrowRight" />
									</View>
								</TouchableRipple>
							) : (
								<CustomText
									className={`${titleType === 'lg' && 'text-grayscale-400 ml-[6]'}`}
									variant={`${titleType === 'md' ? 'headline1Semibold' : 'h1Semibold'}`}
									numberOfLines={1}
								>
									{title}
								</CustomText>
							)
						}
					/>
				)}
				{hasLogo && (
					<TixxSymbol
						color="white"
						style={styles.logo}
						onPress={() => {
							navigation.navigate('Home')
							setCurrentTab(null)
						}}
					/>
				)}
			</View>
			<View className="flex-row ml-auto mr-2">
				{hasMap && (
					<Appbar.Action
						icon={MapIcon}
						animated={false}
						onPress={() => navigation.navigate('NearbyEvents')}
					/>
				)}
				{hasAddTicket && (
					<Appbar.Action
						icon={AddTicketIcon}
						animated={false}
						onPress={() => navigation.navigate('RegisterGuestCode')}
					/>
				)}
				{hasCalendar && (
					<Appbar.Action
						icon={CalendarIcon}
						animated={false}
						onPress={handleCalendarPress}
					/>
				)}
				{hasNotification && (
					<Appbar.Action
						icon={NotificationIcon}
						animated={false}
						onPress={() => navigation.navigate('Notification')}
					/>
				)}
				{hasSettings && (
					<Appbar.Action
						icon={SettingsIcon}
						animated={false}
						onPress={() => navigation.navigate('Settings')}
					/>
				)}
				{hasProfileEdit && (
					<CustomButton
						labelVariant="body1Medium"
						mode="text"
						size="sm"
						onPress={() => navigation.navigate('Profile', { mode: 'edit' })}
						className="mr-1"
					>
						{t('common.edit')}
					</CustomButton>
				)}
				{hasHostActions && <HostActions />}
			</View>
		</Appbar.Header>
	)
}

const NotificationIcon = () => {
	const { data: notifications, refetch } = useNotificationsUnread()

	useFocusEffect(
		useCallback(() => {
			refetch()
		}, [refetch])
	)

	return (
		<View>
			<CustomIcon name={'bell'} size={28} color="white" />
			{notifications && notifications.unreadCount > 0 && (
				<Badge
					size={18}
					numberOfLines={0}
					className={`absolute -top-1 w-[18px] h-[18px] text-grayscale-900 px-0
						${notifications?.unreadCount > 9 ? 'text-[11px]' : 'text-sm'}`}
				>
					{notifications.unreadCount > 99 ? 99 : notifications.unreadCount}
				</Badge>
			)}
		</View>
	)
}

const BackIcon = () => {
	return <CustomIcon name="arrowLeft" />
}

const MapIcon = () => {
	const { name } = useRoute()
	const { colors } = useCustomTheme()

	return (
		<CustomIcon
			name={name === 'NearbyEvents' ? 'mapPinFilled' : 'mapPinLine'}
			size={28}
			color={name === 'NearbyEvents' ? colors.primary : 'white'}
		/>
	)
}

const CalendarIcon = () => {
	return <CustomIcon name="calendar" />
}

const SettingsIcon = () => {
	return <CustomIcon fill="red" name="settings" />
}

const AddTicketIcon = () => {
	return <CustomIcon name="addTicket" size={28} color="white" />
}

const HostActions = () => {
	const { params } = useRoute<RouteProp<MainStackParamList, 'HostDetail'>>()
	const hostId = params.hostId
	const { t } = useTranslation()
	const { shareLink } = useShareLink()

	const { data: isFollowing } = useIsFollowingHost(hostId)
	const { data: host } = useHost(hostId)
	const { mutateAsync: toggleHostFollow } = useToggleHostFollow()

	const handleFollow = () => {
		toggleHostFollow(hostId, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['host', hostId] })
			}
		})
	}

	return (
		<View className="flex-row items-center">
			<TouchableRipple
				onPress={handleFollow}
				className={`ml-2 rounded-lg py-[5px] px-3 ${
					isFollowing?.isFollowing ? 'bg-grayscale-500' : 'bg-grayscale-100'
				}`}
				borderless
			>
				<CustomText
					variant="body3Medium"
					className={
						isFollowing?.isFollowing ? 'text-grayscale-0' : 'text-grayscale-900'
					}
				>
					{isFollowing?.isFollowing
						? t('common.following')
						: t('common.follow')}
				</CustomText>
			</TouchableRipple>
			<Appbar.Action
				icon={ShareIcon}
				onPress={() =>
					shareLink({
						type: 'host',
						id: hostId,
						title: host?.name,
						description: host?.description || undefined,
						imageUrl: host?.imageUrl
					})
				}
				animated={false}
			/>
		</View>
	)
}

const ShareIcon = () => <CustomIcon name="share" color="white" />

const styles = StyleSheet.create({
	logo: {
		marginLeft: 14
	}
})
