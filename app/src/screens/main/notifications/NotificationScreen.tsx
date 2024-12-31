import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import NotificationItem from '@/components/notifications/NotificationItem'
import { CustomText } from '@/components/ui/display/CustomText'
import { useMarkAsReadNotifications } from '@/hooks/queries/notifications/useMarkAsReadNotifications'
import { useNotifications } from '@/hooks/queries/notifications/useNotifications'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'Notification'>

export default function NotificationScreen({ navigation }: Props) {
	const { data: notifications } = useNotifications()
	const { mutate: markAsRead } = useMarkAsReadNotifications()

	useEffect(() => {
		if (notifications) {
			markAsRead()
		}
	}, [notifications, markAsRead])

	return notifications?.length ? (
		<FlatList
			data={notifications}
			renderItem={({ item }) => (
				<NotificationItem
					notification={item}
					onPress={() => navigation.navigate('ReceivedTickets')}
				/>
			)}
			contentContainerStyle={styles.container}
		/>
	) : (
		<View className="flex-1 items-center justify-center">
			<CustomText variant="body2Medium" className="text-grayscale-5">
				알림이 없습니다.
			</CustomText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { paddingTop: 12 }
})
