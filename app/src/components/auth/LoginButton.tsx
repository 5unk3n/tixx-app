import {
	APP_NAME,
	CONSUMER_KEY,
	CONSUMER_SECRET,
	SERVICE_URL_SCHEME_IOS,
	GOOGLE_WEB_CLIENT_ID,
	GOOGLE_IOS_CLIENT_ID
} from '@env'
import appleAuth, {
	AppleRequestResponse
} from '@invertase/react-native-apple-authentication'
import {
	GoogleSignin,
	statusCodes
} from '@react-native-google-signin/google-signin'
import {
	login as kakaoLogin,
	getProfile as getKakaoProfile
} from '@react-native-seoul/kakao-login'
import NaverLogin from '@react-native-seoul/naver-login'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { APPLE_AUTH_KEY } from '@/constants/storeKey'
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
	const navigation = useNavigation()
	const { t } = useTranslation()
	const { setOAuthData } = useSignUpStore()
	const { login, recentLoginProvider } = useAuth()
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
		} else if (provider === 'google') {
			GoogleSignin.configure({
				webClientId: GOOGLE_WEB_CLIENT_ID, // 필수: 웹 클라이언트 ID
				iosClientId: GOOGLE_IOS_CLIENT_ID, // iOS용 (Firebase 미사용시)
				offlineAccess: true, // 서버에서 사용자 정보 접근 필요시
				scopes: ['profile', 'email'] // 필요한 권한 범위
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
					Toast.show({
						type: 'error',
						text1: t('auth.errors.otherServiceUser')
					})
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
					Toast.show({ type: 'error', text1: error.message })
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
					Toast.show({
						type: 'error',
						text1: t('auth.errors.otherServiceUser')
					})
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
					Toast.show({ type: 'error', text1: error.message })
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
					Toast.show({
						type: 'error',
						text1: t('auth.errors.otherServiceUser')
					})
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
					Toast.show({ type: 'error', text1: error.message })
				}
			}
		}
	}

	const loginWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices()
			const userInfo = await GoogleSignin.signIn()
			if (userInfo.type === 'success') {
				const idToken = userInfo.data.idToken
				await login({
					idToken: idToken,
					provider: 'google'
				})
			}
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					Toast.show({
						type: 'error',
						text1: t('auth.errors.otherServiceUser')
					})
				} else if (error.response?.status === 404) {
					const user = GoogleSignin.getCurrentUser()
					if (user === null) {
						Toast.show({
							type: 'error',
							text1: 'No user data found'
						})
						return
					}

					setOAuthData({
						name: user.user.name || '',
						email: user.user.email || '',
						provider: 'google'
					})

					navigation.navigate('Agreement')
				} else {
					Toast.show({ type: 'error', text1: error.message })
				}
			} else if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				// 사용자가 로그인을 취소한 경우
				Toast.show({
					type: 'error',
					text1: 'Sign in cancelled'
				})
			} else if (error.code === statusCodes.IN_PROGRESS) {
				// 로그인이 이미 진행 중인 경우
				Toast.show({
					type: 'error',
					text1: 'Sign in is already in progress'
				})
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				// 구글 플레이 서비스를 사용할 수 없는 경우
				Toast.show({
					type: 'error',
					text1: 'Play services are not available'
				})
			} else {
				Toast.show({ type: 'error', text1: error.message })
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
			case 'google':
				loginWithGoogle()
				break
			default:
				break
		}
	}

	const renderIcon = (iconName: OAuthProvider) => {
		return <CustomIcon name={iconName} className="mr-4" />
	}

	const stylesByProvider = {
		kakao: {
			backgroundColor: colors.brandColors.kakao,
			color: colors.grayscale[900]
		},
		naver: {
			backgroundColor: colors.brandColors.naver,
			color: colors.grayscale[0]
		},
		apple: {
			backgroundColor: colors.brandColors.apple,
			color: colors.grayscale[900]
		},
		google: {
			backgroundColor: colors.brandColors.google,
			color: colors.grayscale[900]
		}
	}

	return (
		<View className="relative" {...props}>
			{provider === recentLoginProvider && <RecentLoginTooltip />}
			<CustomButton
				mode="contained"
				style={[
					styles.loginButtonContainer,
					{ backgroundColor: stylesByProvider[provider].backgroundColor }
				]}
				labelStyle={{ color: stylesByProvider[provider].color }}
				onPress={handleLogin}
				icon={() => renderIcon(provider)}
			>
				{t(`auth.loginWith.${provider}`)}
			</CustomButton>
		</View>
	)
}

const styles = StyleSheet.create({
	loginButtonContainer: {
		borderWidth: 0
	}
})
