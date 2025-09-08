import notifee, { AndroidImportance } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const displayNotification = async (
	message: FirebaseMessagingTypes.RemoteMessage
) => {
	const { title, body } = message.notification || {}

	const channelId = await notifee.createChannel({
		id: 'default',
		name: 'Default Channel',
		importance: AndroidImportance.HIGH
	})

	await notifee.displayNotification({
		title,
		body,
		android: {
			channelId,
			importance: AndroidImportance.HIGH,
			smallIcon: 'ic_stat_image'
		},
		ios: {
			foregroundPresentationOptions: {
				badge: true,
				sound: true,
				banner: true,
				list: true
			}
		}
	})
}
