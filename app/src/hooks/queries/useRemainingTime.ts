import { differenceInMilliseconds } from 'date-fns'
import { useState, useEffect, useCallback } from 'react'

const calculateRemainingTime = (expiredAt: string) => {
	const now = new Date()
	return Math.max(differenceInMilliseconds(expiredAt, now), 0)
}

export const useRemainingTime = (expiredAt: string) => {
	const [remainingTime, setRemainingTime] = useState(
		calculateRemainingTime(expiredAt)
	)
	const isExpired = remainingTime === 0

	const updateRemainingTime = useCallback(() => {
		const remaining = calculateRemainingTime(expiredAt)

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
