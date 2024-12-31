import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import React from 'react'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { Notifications } from '@/types'

import { CustomText } from '../ui/display/CustomText'

interface NotificationItemProps {
	notification: Notifications[0]
	onPress?: () => void
}

export default function NotificationItem({
	notification,
	onPress,
	...props
}: NotificationItemProps) {
	return (
		<TouchableRipple onPress={onPress} {...props} className="py-3 px-5">
			<View className="flex-row">
				{/* TODO: 이미지 생기면 조건부 렌더링으로 추가하기 */}
				{/* <Image
					source={{ uri: '' }}
					className="w-14 h-14 rounded-full mr-6"
				/> */}
				<View className="flex-1 gap-2">
					<CustomText variant="body3Regular" className="text-primary">
						{notification.title}
					</CustomText>
					<CustomText variant="body1Regular">{notification.body}</CustomText>
					<CustomText variant="body3Regular" className="text-grayscale-5">
						{/* {formatDistanceToNow(notification.createdAt, { locale: ko })} */}
						{formatDistanceToNow(notification.createdAt, {
							locale: ko,
							addSuffix: true
						})}
					</CustomText>
				</View>
			</View>
		</TouchableRipple>
	)
}
