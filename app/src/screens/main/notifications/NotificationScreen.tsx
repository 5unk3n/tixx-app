import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import NotificationItem from '@/components/notifications/NotificationItem'
import { CustomText } from '@/components/ui/display/CustomText'
import Tabs from '@/components/ui/navigation/Tabs'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'

const tabs = ['notice', 'information'] as const

export default function NotificationScreen() {
	const { t } = useTranslation()
	const [currentTab, setCurrentTab] =
		useState<(typeof tabs)[number]>('information')

	const { data: notifications } = useNotifications()
	const notices = notifications?.filter(
		(notification) => notification.data.type === '3'
	)
	const informations = notifications?.filter(
		(notification) => notification.data.type !== '3'
	)

	// TODO: 알림 화면 공지화면 분할
	return (
		<View className="flex-1">
			<Tabs value={currentTab} onChange={setCurrentTab}>
				{tabs.map((tab) => (
					<Tabs.Tab
						key={tab}
						value={tab}
						label={t(`common.notification.tabs.${tab}`)}
					/>
				))}
			</Tabs>
			{currentTab === 'notice' ? (
				<FlatList
					data={notices}
					renderItem={({ item }) => <NotificationItem notification={item} />}
					contentContainerStyle={styles.container}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center">
							<CustomText variant="body2Medium" className="text-grayscale-400">
								{t('common.notification.noNotice')}
							</CustomText>
						</View>
					}
				/>
			) : (
				<FlatList
					data={informations}
					renderItem={({ item }) => <NotificationItem notification={item} />}
					contentContainerStyle={styles.container}
					ListEmptyComponent={
						<View className="flex-1 items-center justify-center">
							<CustomText variant="body2Medium" className="text-grayscale-400">
								{t('common.notification.noNotification')}
							</CustomText>
						</View>
					}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: { paddingTop: 12 }
})
