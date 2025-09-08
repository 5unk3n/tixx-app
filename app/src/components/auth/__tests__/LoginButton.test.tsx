import {
	APP_NAME,
	CONSUMER_KEY,
	CONSUMER_SECRET,
	GOOGLE_IOS_CLIENT_ID,
	GOOGLE_WEB_CLIENT_ID,
	SERVICE_URL_SCHEME_IOS
} from '@env'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import {
	render,
	screen,
	fireEvent,
	waitFor
} from '@testing-library/react-native'
import { AxiosError } from 'axios'
import React from 'react'

import { APPLE_AUTH_KEY } from '@/constants/storeKey'
import { useAuth } from '@/hooks/useAuth'
import { useSignUpStore } from '@/stores/signUpStore'
import { secureStorage } from '@/utils/secureStorage'

import { TestWrapper } from '../../testUtils/TestWrapper'
import LoginButton from '../LoginButton'

jest.mock('@/hooks/useAuth')
jest.mock('@/stores/signUpStore')
jest.mock('@/utils/secureStorage')

jest.mock('@invertase/react-native-apple-authentication', () => ({
	__esModule: true,
	default: {
		performRequest: jest.fn(),
		onCredentialRevoked: jest.fn(() => jest.fn()),
		getCredentialStateForUser: jest.fn(),
		Operation: { LOGIN: 'LOGIN' },
		Scope: { FULL_NAME: 'FULL_NAME', EMAIL: 'EMAIL' },
		State: { AUTHORIZED: 'AUTHORIZED' }
	}
}))

jest.mock('@react-native-google-signin/google-signin', () => ({
	GoogleSignin: {
		configure: jest.fn(),
		hasPlayServices: jest.fn(() => Promise.resolve(true)),
		signIn: jest.fn(),
		getCurrentUser: jest.fn()
	},
	statusCodes: {
		SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
		IN_PROGRESS: 'IN_PROGRESS',
		PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE'
	}
}))

jest.mock('@react-native-seoul/kakao-login', () => ({
	login: jest.fn(),
	getProfile: jest.fn()
}))

jest.mock('@react-native-seoul/naver-login', () => ({
	__esModule: true,
	default: {
		initialize: jest.fn(),
		login: jest.fn(),
		getProfile: jest.fn()
	}
}))

jest.mock('react-native-toast-message', () => ({
	__esModule: true,
	default: {
		show: jest.fn()
	}
}))

const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		navigate: mockNavigate
	})
}))

const mockedUseAuth = useAuth as jest.Mock
const mockedUseSignUpStore = useSignUpStore as jest.Mocked<
	typeof useSignUpStore
>
const mockedSecureStorage = secureStorage as jest.Mocked<typeof secureStorage>

describe('LoginButton', () => {
	const mockLogin = jest.fn<() => Promise<unknown>>()
	const mockSetOAuthData = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		mockLogin.mockClear()
		mockSetOAuthData.mockClear()
		mockedUseAuth.mockReturnValue({
			login: mockLogin,
			recentLoginProvider: null
		})
		mockedUseSignUpStore.mockReturnValue({
			setOAuthData: mockSetOAuthData
		})
	})

	it('initializes Naver SDK on mount for naver provider', () => {
		render(<LoginButton provider="naver" />, { wrapper: TestWrapper })
		expect(
			require('@react-native-seoul/naver-login').default.initialize
		).toHaveBeenCalledWith({
			appName: APP_NAME,
			consumerKey: CONSUMER_KEY,
			consumerSecret: CONSUMER_SECRET,
			serviceUrlSchemeIOS: SERVICE_URL_SCHEME_IOS
		})
	})

	it('initializes Google Signin on mount for google provider', () => {
		render(<LoginButton provider="google" />, { wrapper: TestWrapper })
		expect(
			require('@react-native-google-signin/google-signin').GoogleSignin
				.configure
		).toHaveBeenCalledWith({
			webClientId: GOOGLE_WEB_CLIENT_ID,
			iosClientId: GOOGLE_IOS_CLIENT_ID,
			offlineAccess: true,
			scopes: ['profile', 'email']
		})
	})

	it('handles successful Kakao login', async () => {
		require('@react-native-seoul/kakao-login').login.mockResolvedValue({
			accessToken: 'kakao_access_token'
		})

		render(<LoginButton provider="kakao" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.kakao'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				accessToken: 'kakao_access_token',
				provider: 'kakao'
			})
		})
	})

	it('handles Kakao login new user flow', async () => {
		require('@react-native-seoul/kakao-login').login.mockResolvedValue({
			accessToken: 'kakao_access_token'
		})
		mockLogin.mockRejectedValue(
			Object.assign(new AxiosError('Not Found'), { response: { status: 404 } })
		)
		require('@react-native-seoul/kakao-login').getProfile.mockResolvedValue({
			name: 'Kakao User',
			email: 'kakao@example.com',
			phoneNumber: '+82 10-1234-5678',
			birthyear: '1990',
			birthday: '0101'
		})

		render(<LoginButton provider="kakao" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.kakao'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				accessToken: 'kakao_access_token',
				provider: 'kakao'
			})
		})

		await waitFor(() => {
			expect(mockSetOAuthData).toHaveBeenCalledWith({
				name: 'Kakao User',
				email: 'kakao@example.com',
				phone: '01012345678',
				birthYYYYMMDD: '19900101',
				provider: 'kakao'
			})
		})
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('Agreement')
		})
	})

	it('handles successful Naver login', async () => {
		require('@react-native-seoul/naver-login').default.login.mockResolvedValue({
			successResponse: {
				accessToken: 'naver_access_token'
			}
		})
		mockLogin.mockResolvedValue({ jwt: 'jwt_token', user: { id: 1 } })

		render(<LoginButton provider="naver" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.naver'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				accessToken: 'naver_access_token',
				provider: 'naver'
			})
		})
	})

	it('handles Naver login new user flow', async () => {
		require('@react-native-seoul/naver-login').default.login.mockResolvedValue({
			successResponse: {
				accessToken: 'naver_access_token'
			}
		})
		mockLogin.mockRejectedValue(
			Object.assign(new AxiosError('Not Found'), { response: { status: 404 } })
		)
		require('@react-native-seoul/naver-login').default.getProfile.mockResolvedValue(
			{
				response: {
					name: 'Naver User',
					email: 'naver@example.com',
					mobile: '010-9876-5432',
					birthyear: '1995',
					birthday: '0505'
				}
			}
		)

		render(<LoginButton provider="naver" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.naver'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				accessToken: 'naver_access_token',
				provider: 'naver'
			})
		})

		await waitFor(() => {
			expect(mockSetOAuthData).toHaveBeenCalledWith({
				name: 'Naver User',
				email: 'naver@example.com',
				phone: '01098765432',
				birthYYYYMMDD: '19950505',
				provider: 'naver'
			})
		})
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('Agreement')
		})
	})

	it('handles successful Apple login', async () => {
		require('@invertase/react-native-apple-authentication').default.performRequest.mockResolvedValue(
			{
				identityToken: 'apple_id_token',
				user: 'apple_user_id',
				fullName: { familyName: 'Apple', givenName: 'User' },
				email: 'apple@example.com'
			}
		)
		require('@invertase/react-native-apple-authentication').default.getCredentialStateForUser.mockResolvedValue(
			'AUTHORIZED'
		)
		mockLogin.mockResolvedValue({ jwt: 'jwt_token', user: { id: 1 } })
		mockedSecureStorage.set.mockResolvedValue(undefined)

		render(<LoginButton provider="apple" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.apple'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				accessToken: 'apple_id_token',
				provider: 'apple'
			})
		})
		await waitFor(() => {
			expect(mockedSecureStorage.set).toHaveBeenCalledWith(
				APPLE_AUTH_KEY,
				'{"name":"AppleUser","email":"apple@example.com"}'
			)
		})
	})

	it('handles Apple login new user flow', async () => {
		const appleAuthResponse = {
			identityToken: 'apple_id_token',
			user: 'apple_user_id',
			fullName: { familyName: 'Apple', givenName: 'User' },
			email: 'apple@example.com'
		}
		require('@invertase/react-native-apple-authentication').default.performRequest.mockResolvedValue(
			appleAuthResponse
		)
		require('@invertase/react-native-apple-authentication').default.getCredentialStateForUser.mockResolvedValue(
			'AUTHORIZED'
		)
		mockLogin.mockRejectedValue(
			Object.assign(new AxiosError('Not Found'), { response: { status: 404 } })
		)
		mockedSecureStorage.get.mockResolvedValue(
			'{"name":"AppleUser","email":"apple@example.com"}'
		)

		render(<LoginButton provider="apple" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.apple'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				accessToken: 'apple_id_token',
				provider: 'apple'
			})
		})

		await waitFor(() => {
			expect(mockSetOAuthData).toHaveBeenCalledWith({
				name: 'AppleUser',
				email: 'apple@example.com',
				provider: 'apple'
			})
		})
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('Agreement')
		})
	})

	it('handles successful Google login', async () => {
		require('@react-native-google-signin/google-signin').GoogleSignin.signIn.mockResolvedValue(
			{
				type: 'success',
				data: { idToken: 'google_id_token' }
			}
		)
		mockLogin.mockResolvedValue({ jwt: 'jwt_token', user: { id: 1 } })

		render(<LoginButton provider="google" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.google'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				idToken: 'google_id_token',
				provider: 'google'
			})
		})
	})

	it('handles Google login new user flow', async () => {
		require('@react-native-google-signin/google-signin').GoogleSignin.signIn.mockResolvedValue(
			{
				type: 'success',
				data: { idToken: 'google_id_token' }
			}
		)
		mockLogin.mockRejectedValue(
			Object.assign(new AxiosError('Not Found'), { response: { status: 404 } })
		)
		require('@react-native-google-signin/google-signin').GoogleSignin.getCurrentUser.mockReturnValue(
			{
				user: { name: 'Google User', email: 'google@example.com' }
			}
		)

		render(<LoginButton provider="google" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.google'))

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				idToken: 'google_id_token',
				provider: 'google'
			})
		})

		await waitFor(() => {
			expect(mockSetOAuthData).toHaveBeenCalledWith({
				name: 'Google User',
				email: 'google@example.com',
				provider: 'google'
			})
		})
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('Agreement')
		})
	})

	it('shows toast on Google sign-in cancelled', async () => {
		require('@react-native-google-signin/google-signin').GoogleSignin.signIn.mockRejectedValue(
			{
				code: 'SIGN_IN_CANCELLED'
			}
		)

		render(<LoginButton provider="google" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.google'))

		await waitFor(() => {
			expect(
				require('react-native-toast-message').default.show
			).toHaveBeenCalledWith({
				type: 'error',
				text1: 'Sign in cancelled'
			})
		})
	})

	it('shows toast on Google Play services not available', async () => {
		require('@react-native-google-signin/google-signin').GoogleSignin.signIn.mockRejectedValue(
			{
				code: 'PLAY_SERVICES_NOT_AVAILABLE'
			}
		)

		render(<LoginButton provider="google" />, { wrapper: TestWrapper })
		fireEvent.press(screen.getByText('auth.loginWith.google'))

		await waitFor(() => {
			expect(
				require('react-native-toast-message').default.show
			).toHaveBeenCalledWith({
				type: 'error',
				text1: 'Play services are not available'
			})
		})
	})
})
