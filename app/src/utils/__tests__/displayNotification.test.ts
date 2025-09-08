import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import notifee, { AndroidImportance } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

import { displayNotification } from '../displayNotification'

// The module is already mocked in jest-setup.js, so we just need to typecast it
const mockedNotifee = notifee as jest.Mocked<typeof notifee>

describe('displayNotification', () => {
	beforeEach(() => {
		// Clear mock history before each test
		jest.clearAllMocks()
	})

	it('should create a channel and display a notification with the correct parameters', async () => {
		const mockMessage: FirebaseMessagingTypes.RemoteMessage = {
			notification: {
				title: 'Test Title',
				body: 'Test Body'
			},
			fcmOptions: {}
		}

		const channelId = 'mock-channel-id'
		mockedNotifee.createChannel.mockResolvedValue(channelId)

		await displayNotification(mockMessage)

		// Verify channel creation
		expect(mockedNotifee.createChannel).toHaveBeenCalledWith({
			id: 'default',
			name: 'Default Channel',
			importance: AndroidImportance.HIGH
		})

		// Verify notification display
		expect(mockedNotifee.displayNotification).toHaveBeenCalledWith({
			title: 'Test Title',
			body: 'Test Body',
			android: {
				channelId: channelId,
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
	})

	it('should handle notifications with no title or body', async () => {
		const mockMessage: FirebaseMessagingTypes.RemoteMessage = {
			notification: {}, // Empty notification object
			fcmOptions: {}
		}

		const channelId = 'mock-channel-id'
		mockedNotifee.createChannel.mockResolvedValue(channelId)

		await displayNotification(mockMessage)

		expect(mockedNotifee.createChannel).toHaveBeenCalledTimes(1)
		expect(mockedNotifee.displayNotification).toHaveBeenCalledWith({
			title: undefined,
			body: undefined,
			android: {
				channelId: channelId,
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
	})

	it('should handle messages with no notification payload', async () => {
		const mockMessage: FirebaseMessagingTypes.RemoteMessage = {
			fcmOptions: {}
		} // No notification property

		const channelId = 'mock-channel-id'
		mockedNotifee.createChannel.mockResolvedValue(channelId)

		await displayNotification(mockMessage)

		expect(mockedNotifee.createChannel).toHaveBeenCalledTimes(1)
		expect(mockedNotifee.displayNotification).toHaveBeenCalledWith({
			title: undefined,
			body: undefined,
			android: {
				channelId: channelId,
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
	})
})
