import { useNavigation } from '@react-navigation/native'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { useMarkAsReadNotifications } from '@/hooks/queries/notifications/useMarkAsReadNotifications'
import { Notifications } from '@/types'

import { CustomText } from '../ui/display/CustomText'

interface NotificationItemProps {
	notification: Notifications[0]
}

export default function NotificationItem({
	notification,
	...props
}: NotificationItemProps) {
	const navigation = useNavigation()
	const { i18n } = useTranslation()

	const { mutate: markAsRead } = useMarkAsReadNotifications()

	const handlePress = () => {
		markAsRead(notification.id)
		switch (notification.data.type) {
			case '0':
				navigation.navigate('SentTickets')
				break
			case '1':
				navigation.navigate('ReceivedTickets')
				break
			case '2':
				// TODO: event detail 로 가면 좋을듯
				break
			case '3':
				// TODO: 공지 상세 스크린 추가하기
				break
			case '4':
				// TODO: 이벤트 취소 시 어디로?
				break
			default:
				break
		}
	}

	return (
		<TouchableRipple onPress={handlePress} {...props} className="py-3 px-5">
			<View className="flex-row">
				{/* TODO: 이미지 생기면 조건부 렌더링으로 추가하기 */}
				{/* <Image
					source={{ uri: '' }}
					className="w-14 h-14 rounded-full mr-6"
				/> */}
				<View className="flex-1 gap-2">
					<CustomText
						variant="body3Regular"
						className={notification.readAt ? 'text-point-900' : 'text-primary'}
					>
						{notification.title}
					</CustomText>
					<CustomText
						variant="body1Regular"
						className={
							notification.readAt ? 'text-grayscale-400' : 'text-white'
						}
					>
						{notification.body}
					</CustomText>
					<CustomText variant="body3Regular" className="text-grayscale-400">
						{formatDistanceToNow(notification.createdAt, {
							locale: i18n.language === 'ko' ? ko : enUS,
							addSuffix: true
						})}
					</CustomText>
				</View>
			</View>
		</TouchableRipple>
	)
}
