import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, Linking, View } from 'react-native'
import { Switch } from 'react-native-paper'
import { checkNotifications } from 'react-native-permissions'

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
	const { t } = useTranslation()
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
		<View className="mt-8 pb-3">
			<CustomText
				variant="body3Medium"
				className="mx-5 mb-3 text-grayscale-400"
			>
				{t('common.notification.title')}
			</CustomText>
			<CustomListItem
				onPress={() => Linking.openSettings()}
				pointerEvents="box-only"
				title={t('common.notification.title')}
				rightElement={<Switch value={isNotificationEnabled} />}
				description={t('common.notification.description')}
			/>
			<CustomListItem
				title={t('common.notification.marketing')}
				rightElement={
					<Switch
						value={!!user.marketingOptIn}
						onChange={toggleMarketingNotification}
					/>
				}
			/>
		</View>
	)
}
