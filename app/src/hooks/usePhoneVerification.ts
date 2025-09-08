import { isAxiosError } from 'axios'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { getHash, removeListener } from 'react-native-otp-verify'
import Toast from 'react-native-toast-message'

import { PhonAuthRequestInput } from '@/types'

import { useRemainingTime } from './queries/useRemainingTime'
import { useRequestPhoneAuthCode } from './queries/useRequestPhoneAuthCode'
import { useVerifyPhoneAuthCode } from './queries/useVerifyPhoneAuthCode'

export const usePhoneVerification = (
	onAuthCodeReceived: (code: string) => void
) => {
	const { t } = useTranslation()
	const [expiredTime, setExpiredTime] = useState('')
	const [isCodeSent, setIsCodeSent] = useState(false)
	const firstRequestTimestamp = useRef<null | Date>(null)
	const countRef = useRef(0)
	const hashRef = useRef<string[]>([])

	const { mutateAsync: requestPhoneAuthCode } = useRequestPhoneAuthCode()
	const { mutateAsync: verifyPhoneAuthCode } = useVerifyPhoneAuthCode()
	const { remainingTime } = useRemainingTime(
		expiredTime || new Date().toString()
	)
	const formattedRemainingTime = format(remainingTime, 'mm:ss')
	const isResendDisabled = remainingTime > 175 * 1000

	useEffect(() => {
		if (Platform.OS === 'android') {
			getHash()
				.then((hash) => {
					hashRef.current = hash
				})
				.catch(console.error)

			return () => removeListener()
		}
	}, [onAuthCodeReceived])

	const requestCode = async ({ phone }: Omit<PhonAuthRequestInput, 'hash'>) => {
		try {
			if (countRef.current === 0) {
				firstRequestTimestamp.current = new Date()
			}
			countRef.current = countRef.current + 1

			const { expiredAt } = await requestPhoneAuthCode({
				phone,
				hash: hashRef.current[0]
			})
			setIsCodeSent(true)
			setExpiredTime(expiredAt)
			return true
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.status === 429) {
					Toast.show({
						type: 'error',
						text1: t('auth.errors.tooManyAttempts')
					})
				} else if (
					error.response?.status === 400 &&
					error.response?.data.message?.includes('올바르지 않은 휴대폰 번호')
				) {
					Toast.show({
						type: 'error',
						text1: t('auth.errors.invalidPhoneNumber')
					})
				} else {
					throw error
				}
			}
			return false
		}
	}

	const verifyCode = async (phone: string, authCode: string) => {
		try {
			const { success, errorMsg } = await verifyPhoneAuthCode({
				phone,
				authCode
			})

			if (success) {
				Toast.show({ type: 'success', text1: t('auth.verifiedMessage') })
				return true
			}

			console.error(errorMsg)
			if (errorMsg === 'Phone auth code not found') {
				Toast.show({ type: 'error', text1: t('auth.errors.invalidCode') })
			} else if (errorMsg === 'Phone auth code has expired') {
				Toast.show({ type: 'error', text1: t('auth.errors.expiredCode') })
			} else if (errorMsg === 'Invalid phone auth code') {
				Toast.show({ type: 'error', text1: t('auth.errors.invalidCode') })
			}
			return false
		} catch (error) {
			Toast.show({ type: 'error', text1: t('auth.errors.verificationFailed') })
			return false
		}
	}

	return {
		requestCode,
		verifyCode,
		remainingTime: formattedRemainingTime,
		isCodeSent,
		isResendDisabled,
		firstReqTime: firstRequestTimestamp.current,
		reqCount: countRef.current
	}
}
