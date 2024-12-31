import { useSuspenseQuery } from '@tanstack/react-query'
import { differenceInMilliseconds } from 'date-fns'

import { getQRCode } from '@/apis/users/getQRCode'

import { useRemainingTime } from '../useRemainingTime'

const GC_TIME = 1000 * 30

export const useQRCode = () => {
	const {
		data: QRCode,
		refetch,
		isPending,
		isFetching
	} = useSuspenseQuery({
		queryKey: ['qrcode'],
		queryFn: getQRCode,
		staleTime: (query) =>
			query.state.data
				? differenceInMilliseconds(
						query.state.data?.metadata.expiredAt,
						new Date()
					)
				: 0,
		gcTime: GC_TIME,
		retry: 3
	})

	const { remainingTime, isExpired } = useRemainingTime(
		QRCode?.metadata.expiredAt || new Date().toString()
	)

	if (isExpired) {
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
