import messaging from '@react-native-firebase/messaging'
import { useCallback } from 'react'

import { useUpdateUser } from './queries/useUpdateUser'

export const useFCMToken = () => {
	const { mutateAsync: updateUser } = useUpdateUser()

	const getToken = async () => {
		const authStatus = await messaging().requestPermission()
		if (
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL
		) {
			const fcmToken = await messaging().getToken()
			return fcmToken
		}
		throw new Error('FCM 토큰을 가져오는데 실패했습니다.')
	}

	const updateToken = useCallback(async () => {
		const fcmToken = await getToken()

		await updateUser({ fcmToken })
	}, [updateUser])

	const removeToken = async () => {
		await messaging().deleteToken()
	}

	return { updateToken, removeToken }
}
