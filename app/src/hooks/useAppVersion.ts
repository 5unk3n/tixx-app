import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Platform, Linking, AppState } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { useVersion } from '@/hooks/queries/versions/useVersion'
import { Version } from '@/types'
import { compareVersion } from '@/utils/compareVersion'

const IOS_APP_ID = '6737306169'
const ANDROID_PACKAGE_NAME = 'com.tixx.mobile'

const IOS_STORE_URL = `itms-apps://itunes.apple.com/app/id${IOS_APP_ID}`
const IOS_WEB_URL = `https://apps.apple.com/app/id${IOS_APP_ID}`

const ANDROID_STORE_URL = `market://details?id=${ANDROID_PACKAGE_NAME}`
const ANDROID_WEB_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`

export const useAppVersion = (shouldCheckUpdate = false) => {
	const { t } = useTranslation()
	const os = Platform.OS as Version['os']
	const { data: version } = useVersion(os)
	const currentVersion = DeviceInfo.getVersion()
	const isNeedUpdate = version
		? compareVersion(currentVersion, version.minVersion) < 0
		: false

	const appState = useRef(AppState.currentState)

	useEffect(() => {
		if (!shouldCheckUpdate) return

		const checkAndAlert = () => {
			if (isNeedUpdate) {
				Alert.alert(
					t('version.update_required_title'),
					t('version.update_required_message'),
					[
						{
							text: t('version.update'),
							onPress: () => {
								if (os === 'ios') {
									Linking.canOpenURL(IOS_STORE_URL).then((supported) => {
										if (supported) {
											Linking.openURL(IOS_STORE_URL)
										} else {
											Linking.openURL(IOS_WEB_URL)
										}
									})
								} else if (os === 'android') {
									Linking.canOpenURL(ANDROID_STORE_URL).then((supported) => {
										if (supported) {
											Linking.openURL(ANDROID_STORE_URL)
										} else {
											Linking.openURL(ANDROID_WEB_URL)
										}
									})
								}
							}
						}
					],
					{ cancelable: false }
				)
			}
		}

		checkAndAlert()

		const subscription = AppState.addEventListener('change', (nextAppState) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				checkAndAlert()
			}
			appState.current = nextAppState
		})

		return () => {
			subscription.remove()
		}
	}, [isNeedUpdate, os, t, shouldCheckUpdate])

	return { currentVersion, isNeedUpdate, latestVersion: version?.latestVersion }
}
