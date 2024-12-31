import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { Appbar, TouchableRipple } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import { useNotificationsUnread } from '@/hooks/queries/notifications/useNotificationsUnread'
import { MainStackParamList } from '@/types/navigation'

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
	hasProfileEdit
}: CustomHeaderProps) {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>()

	const handleCalendarPress = () => {
		Toast.show({
			type: 'error',
			text1: 'Calendar'
		})
	}

	return (
		<Appbar.Header className="flex-row h-14" statusBarHeight={0}>
			<View className="flex-row items-center ml-5">
				{hasBack && (
					<Appbar.Action
						className="mr-[5] -ml-[7]"
						icon={BackIcon}
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
											className={`${titleType === 'lg' && 'text-grayscale-5 ml-[6]'}`}
											variant={`${titleType === 'md' ? 'headline1Semibold' : 'h1Semibold'}`}
										>
											{title}
										</CustomText>
										<CustomIcon name="arrowRight" />
									</View>
								</TouchableRipple>
							) : (
								<CustomText
									className={`${titleType === 'lg' && 'text-grayscale-5 ml-[6]'}`}
									variant={`${titleType === 'md' ? 'headline1Semibold' : 'h1Semibold'}`}
								>
									{title}
								</CustomText>
							)
						}
					/>
				)}
				{hasLogo && <CustomIcon name="tixxLogo" width={84} height={28} />}
			</View>
			<View className="flex-row ml-auto">
				{hasCalendar && (
					<Appbar.Action icon={CalendarIcon} onPress={handleCalendarPress} />
				)}
				{hasNotification && (
					<Appbar.Action
						icon={NotificationIcon}
						onPress={() => navigation.navigate('Notification')}
					/>
				)}
				{hasSettings && (
					<Appbar.Action
						icon={SettingsIcon}
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
						수정
					</CustomButton>
				)}
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
			<CustomIcon name="notification" />
			{notifications?.hasUnread && (
				<View className="absolute top-0 right-0 w-1 h-1 bg-primary rounded-full" />
			)}
		</View>
	)
}

const BackIcon = () => {
	return <CustomIcon name="arrowLeft" />
}

const CalendarIcon = () => {
	return <CustomIcon name="calendar" />
}

const SettingsIcon = () => {
	return <CustomIcon fill="red" name="settings" />
}
