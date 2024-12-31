import {
	APP_NAME,
	CONSUMER_KEY,
	CONSUMER_SECRET,
	SERVICE_URL_SCHEME_IOS
} from '@env'
import appleAuth, {
	AppleRequestResponse
} from '@invertase/react-native-apple-authentication'
import {
	login as kakaoLogin,
	getProfile as getKakaoProfile
} from '@react-native-seoul/kakao-login'
import NaverLogin from '@react-native-seoul/naver-login'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import { ERRORS } from '@/constants/errors'
import { APPLE_AUTH_KEY } from '@/constants/storeKey'
import { UI } from '@/constants/ui'
import { useAuth } from '@/hooks/useAuth'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { useSignUpStore } from '@/stores/signUpStore'
import { OAuthProvider } from '@/types'
import { formatDateToYYYYMMDD, normalizePhone } from '@/utils/formatters'
import { secureStorage } from '@/utils/secureStorage'

import RecentLoginTooltip from './RecentLoginTooltip'
import CustomIcon from '../ui/display/CustomIcon'
import CustomButton from '../ui/input/CustomButton'

interface LoginButtonProps {
	provider: OAuthProvider
}

export default function LoginButton({ provider, ...props }: LoginButtonProps) {
	const { setOAuthData } = useSignUpStore()
	const { login, recentLoginProvider } = useAuth()
	const navigation = useNavigation()
	const { colors } = useCustomTheme()

	useEffect(() => {
		if (provider === 'naver') {
			NaverLogin.initialize({
				appName: APP_NAME,
				consumerKey: CONSUMER_KEY,
				consumerSecret: CONSUMER_SECRET,
				serviceUrlSchemeIOS: SERVICE_URL_SCHEME_IOS
			})
		} else if (provider === 'apple') {
			return appleAuth.onCredentialRevoked(async () => {
				console.warn(
					'If this function executes, User Credentials have been Revoked'
				)
			})
		}
	}, [provider])

	const loginWithKakao = async () => {
		try {
			const { accessToken } = await kakaoLogin()
			await login({ accessToken, provider: 'kakao' })
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					Toast.show({ type: 'error', text1: ERRORS.AUTH.OTHER_SERVICE_USER })
				} else if (error.response?.status === 404) {
					const kakaoProfile = await getKakaoProfile()

					setOAuthData({
						name: kakaoProfile.name,
						email: kakaoProfile.email,
						phone: normalizePhone(kakaoProfile.phoneNumber || ''),
						birthYYYYMMDD: formatDateToYYYYMMDD(
							`${kakaoProfile.birthyear || ''} + ${kakaoProfile.birthday || ''}`
						),
						provider: 'kakao'
					})

					navigation.navigate('Agreement')
				} else {
					Toast.show({ type: 'error', text1: error.response?.data.message })
				}
			}
		}
	}

	const loginWithNaver = async () => {
		let accessToken: string | null = null
		try {
			const { successResponse } = await NaverLogin.login()

			if (successResponse) {
				accessToken = successResponse.accessToken
				await login({ accessToken, provider: 'naver' })
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					Toast.show({ type: 'error', text1: ERRORS.AUTH.OTHER_SERVICE_USER })
				} else if (error.response?.status === 404 && accessToken) {
					const { response: naverProfile } =
						await NaverLogin.getProfile(accessToken)

					setOAuthData({
						name: naverProfile.name,
						email: naverProfile.email,
						phone: normalizePhone(naverProfile.mobile || ''),
						birthYYYYMMDD: formatDateToYYYYMMDD(
							`${naverProfile.birthyear || ''}${naverProfile.birthday || ''}`
						),
						provider: 'naver'
					})

					navigation.navigate('Agreement')
				} else {
					Toast.show({ type: 'error', text1: error.response?.data.message })
				}
			}
		}
	}

	const loginWithApple = async () => {
		let response: AppleRequestResponse | null = null
		try {
			response = await appleAuth.performRequest({
				requestedOperation: appleAuth.Operation.LOGIN,
				requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
			})

			if (response.fullName && response.email) {
				// 이름과 이메일은 처음 로그인할때만 받을 수 있음.
				secureStorage.set(
					APPLE_AUTH_KEY,
					JSON.stringify({
						name:
							(response.fullName.familyName || '') +
							(response.fullName.givenName || ''),
						email: response.email
					})
				)
			}

			// /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
			const credentialState = await appleAuth.getCredentialStateForUser(
				response.user
			)

			if (
				credentialState === appleAuth.State.AUTHORIZED &&
				response.identityToken
			) {
				await login({
					accessToken: response.identityToken,
					provider: 'apple'
				})
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					Toast.show({ type: 'error', text1: ERRORS.AUTH.OTHER_SERVICE_USER })
				} else if (error.response?.status === 404 && response?.identityToken) {
					const string = await secureStorage.get(APPLE_AUTH_KEY)

					if (!string) {
						throw new Error('No user data found')
					}

					const { name, email } = JSON.parse(string) as {
						name: string
						email: string
					}

					setOAuthData({
						name: name,
						email: email,
						provider: 'apple'
					})

					navigation.navigate('Agreement')
				} else {
					Toast.show({ type: 'error', text1: error.response?.data.message })
				}
			}
		}
	}

	const handleLogin = () => {
		switch (provider) {
			case 'kakao':
				loginWithKakao()
				break
			case 'naver':
				loginWithNaver()
				break
			case 'apple':
				loginWithApple()
				break
			default:
				break
		}
	}

	const renderIcon = (iconName: OAuthProvider) => {
		return <CustomIcon name={iconName} className="mr-4" />
	}

	const styles = {
		kakao: {
			backgroundColor: colors.brandColors.kakao,
			color: colors.grayscale.b
		},
		naver: {
			backgroundColor: colors.brandColors.naver,
			color: colors.grayscale.w
		},
		apple: {
			backgroundColor: colors.brandColors.apple,
			color: colors.grayscale.b
		}
	}

	return (
		<View className="relative" {...props}>
			{provider === recentLoginProvider && <RecentLoginTooltip />}
			<CustomButton
				mode="contained"
				style={{ backgroundColor: styles[provider].backgroundColor }}
				labelStyle={{ color: styles[provider].color }}
				onPress={handleLogin}
				icon={() => renderIcon(provider)}
			>
				{UI.AUTH[(provider.toUpperCase() + '_LOGIN') as keyof typeof UI.AUTH]}
			</CustomButton>
		</View>
	)
}
