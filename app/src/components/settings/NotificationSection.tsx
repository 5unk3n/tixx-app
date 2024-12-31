import React, { useEffect, useState } from 'react'
import { AppState, Linking, View } from 'react-native'
import { Switch } from 'react-native-paper'
import { checkNotifications } from 'react-native-permissions'

import { UI } from '@/constants/ui'
import { useUpdateUser } from '@/hooks/queries/useUpdateUser'
import { User } from '@/types'

import CustomListItem from '../ui/display/CustomListItem'
import { CustomText } from '../ui/display/CustomText'

interface NotificationSectionProps {
	user: User
}

export default function NotificationSection({
	user
}: NotificationSectionProps) {
	const { mutate: updateUser } = useUpdateUser()
	const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)

	const toggleMarketingNotification = () => {
		updateUser({
			marketingOptIn: user.marketingOptIn ? 0 : 1
		})
	}

	useEffect(() => {
		const checkPermission = async () => {
			const permission = await checkNotifications()
			setIsNotificationEnabled(permission.status === 'granted')
		}
		const unsubscribe = AppState.addEventListener('change', (nextAppState) => {
			if (nextAppState === 'active') {
				checkPermission()
			}
		})

		checkPermission()

		return () => {
			unsubscribe.remove()
		}
	}, [])

	return (
		<View className="mt-6 pb-3">
			<CustomText variant="body3Medium" className="mx-5 mb-3 text-grayscale-5">
				{UI.COMMON.NOTIFICATION}
			</CustomText>
			<CustomListItem
				onPress={() => Linking.openSettings()}
				pointerEvents="box-only"
				title={UI.COMMON.SETTING_NOTIFICATION}
				right={() => <Switch value={isNotificationEnabled} />}
				description={UI.COMMON.NOTIFICATION_DESCRIPTION}
			/>
			<CustomListItem
				title={UI.COMMON.SETTING_MARKETING_NOTIFICATION}
				right={() => (
					<Switch
						value={!!user.marketingOptIn}
						onChange={toggleMarketingNotification}
					/>
				)}
			/>
		</View>
	)
}
