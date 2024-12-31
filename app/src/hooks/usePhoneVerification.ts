import { isAxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import {
	getHash,
	removeListener,
	startOtpListener
} from 'react-native-otp-verify'
import Toast from 'react-native-toast-message'

import { PhonAuthRequestInput } from '@/types'
import { formatRemainingTime } from '@/utils/formatters'

import { useRequestPhoneAuthCode } from './queries/useRequestPhoneAuthCode'
import { useVerifyPhoneAuthCode } from './queries/useVerifyPhoneAuthCode'

// FIXME: useRemaining 사용
export const usePhoneVerification = (
	onAuthCodeReceived: (code: string) => void
) => {
	const [expiredTime, setExpiredTime] = useState('')
	const [remainingTime, setRemainingTime] = useState('')
	const hashRef = useRef<string[]>([])

	const { mutateAsync: requestPhoneAuthCode } = useRequestPhoneAuthCode()
	const { mutateAsync: verifyPhoneAuthCode } = useVerifyPhoneAuthCode()

	useEffect(() => {
		if (Platform.OS === 'android') {
			getHash()
				.then((hash) => {
					hashRef.current = hash
				})
				.catch(console.error)

			startOtpListener((message) => {
				const [_, extractedOtp] = /(\d{6})/g.exec(message) || []
				if (extractedOtp) {
					onAuthCodeReceived(extractedOtp)
				}
			})

			return () => removeListener()
		}
	}, [onAuthCodeReceived])

	const startCountdown = (
		endAt: string,
		updateCallback: (time: string) => void
	) => {
		const timer = setInterval(() => {
			const remaining = formatRemainingTime(endAt)
			updateCallback(remaining)

			if (remaining === '00:00') {
				clearInterval(timer)
			}
		}, 1000)
		return timer
	}

	useEffect(() => {
		if (expiredTime) {
			const timer = startCountdown(expiredTime, setRemainingTime)
			return () => clearInterval(timer)
		}
	}, [expiredTime])

	const requestCode = async ({
		carrier,
		phone
	}: Omit<PhonAuthRequestInput, 'hash'>) => {
		try {
			const { expiredAt } = await requestPhoneAuthCode({
				carrier,
				phone,
				hash: hashRef.current[0]
			})
			setExpiredTime(expiredAt)
			return true
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.status === 429) {
					Toast.show({
						type: 'error',
						text1: '오늘 인증 시도 횟수를 초과했습니다. 내일 다시 시도해주세요.'
					})
				} else {
					Toast.show({ type: 'error', text1: error.response?.data.message })
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
				Toast.show({ type: 'success', text1: '인증되었습니다' })
				return true
			}

			if (errorMsg === 'Phone auth code not found') {
				Toast.show({ type: 'error', text1: '인증번호를 다시 확인해주세요' })
			} else if (errorMsg === 'Phone auth code has expired') {
				Toast.show({ type: 'error', text1: '인증번호가 만료되었습니다' })
			} else if (errorMsg === 'Invalid phone auth code') {
				Toast.show({ type: 'error', text1: '인증번호를 다시 확인해주세요' })
			}
			return false
		} catch (error) {
			Toast.show({ type: 'error', text1: '인증코드 검증에 실패했습니다' })
			return false
		}
	}

	return { requestCode, verifyCode, remainingTime, isCodeSent: !!expiredTime }
}
