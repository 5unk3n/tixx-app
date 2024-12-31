import { differenceInMilliseconds } from 'date-fns'
import { useState, useEffect, useCallback } from 'react'

export const useRemainingTime = (expiredAt: string) => {
	const [remainingTime, setRemainingTime] = useState(0)
	const isExpired = remainingTime === 0

	const updateRemainingTime = useCallback(() => {
		const now = new Date()
		const remaining = differenceInMilliseconds(expiredAt, now)

		if (remaining <= 0) {
			setRemainingTime(0)
			return
		}

		setRemainingTime(remaining)
	}, [expiredAt])

	useEffect(() => {
		updateRemainingTime()
		const intervalId = setInterval(updateRemainingTime, 1000)

		return () => clearInterval(intervalId)
	}, [updateRemainingTime])

	return { remainingTime, isExpired }
}
