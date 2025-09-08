import { useFocusEffect } from '@react-navigation/native'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import {
	disableSecureView,
	enabled,
	enableSecureView
} from 'react-native-screenshot-prevent'

import { getQRCode } from '@/apis/users/getQRCode'

import { useRemainingTime } from '../useRemainingTime'

const STALE_GC_TIME_MS = 1000 * 30

export const useQRCode = () => {
	const [isFocused, setIsFocused] = useState(false)

	const {
		data: QRCode,
		refetch,
		isPending,
		isFetching
	} = useSuspenseQuery({
		queryKey: ['qrcode'],
		queryFn: getQRCode,
		staleTime: STALE_GC_TIME_MS,
		gcTime: STALE_GC_TIME_MS,
		retry: 3
	})

	const { remainingTime, isExpired } = useRemainingTime(
		QRCode?.metadata.expiredAt || new Date().toString()
	)

	useFocusEffect(
		useCallback(() => {
			setIsFocused(true)
			enabled(true)
			if (!__DEV__) {
				enableSecureView()
			}

			return () => {
				setIsFocused(false)
				enabled(false)
				if (!__DEV__) {
					disableSecureView()
				}
			}
		}, [])
	)

	if (isExpired && !isFetching && isFocused) {
		refetch()
	}

	const remainingTimeToSeconds = Math.floor(remainingTime / 1000)

	return {
		QRCode,
		remainingTime: remainingTimeToSeconds,
		isPending,
		isFetching
	}
}
