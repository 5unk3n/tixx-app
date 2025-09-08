import messaging from '@react-native-firebase/messaging'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useUpdateUser } from './queries/useUpdateUser'

export const useFCMToken = () => {
	const { mutateAsync: updateUser } = useUpdateUser()
	const { i18n } = useTranslation()

	const getToken = async () => {
		try {
			await messaging().requestPermission()
			const fcmToken = await messaging().getToken()
			return fcmToken
		} catch (error) {
			console.error(error)
			throw new Error('FCM 토큰을 가져오는데 실패했습니다.')
		}
	}

	const updateToken = useCallback(async () => {
		const fcmToken = await getToken()

		// FCM 토큰과 앱 언어를 한 번에 업데이트하는 이유:
		// - 네트워크 요청을 최소화하기 위함
		// - 서버에서 두 정보가 항상 함께 필요함
		await updateUser({
			fcmToken,
			appLanguage: i18n.language === 'ko' ? 'ko' : 'en'
		})
	}, [i18n.language, updateUser])

	const removeToken = async () => {
		await messaging().deleteToken()
	}

	return { updateToken, removeToken }
}
