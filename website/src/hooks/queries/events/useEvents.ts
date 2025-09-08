import { useQuery } from '@tanstack/react-query'
import { parse } from 'date-fns'

import { getEvents } from '@/apis/events/getEvents'
import { Category, Status } from '@/types'

const getDateFromString = (date: string, time: string) => {
	return parse(date + time, 'yyyy-MM-ddHH:mm:ss', new Date())
}

const now = new Date()

export const useEvents = (
	hostId: number,
	category: Category = 'all',
	status: Status = 'all'
) => {
	return useQuery({
		queryKey: ['event', `host-${hostId}`],
		queryFn: () => getEvents(hostId),
		select: (events) => {
			const filteredEvents = events
				.filter((event) => {
					if (category === 'all') {
						return true
					}
					return event.tags[0].tag === category
				})
				.filter((event) => {
					if (status === 'all') {
						return true
					}

					const startDate = getDateFromString(event.startDate, event.startTime)
					const endDate = getDateFromString(event.endDate, event.endTime)

					if (status === 'notStarted') {
						return now < startDate
					}

					if (status === 'inProgress') {
						return now >= startDate && now <= endDate
					}

					if (status === 'completed') {
						return now > endDate
					}

					return false
				})

			return filteredEvents
		}
	})
}
