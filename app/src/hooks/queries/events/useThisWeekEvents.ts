import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { isThisISOWeek, parseISO } from 'date-fns'

import { getEvents } from '@/apis/events/getEvents'

interface UseThisWeekEventsOptions {
	limit?: number
}

export const useThisWeekEvents = ({
	limit = 10
}: UseThisWeekEventsOptions = {}) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['events', 'this-week', limit],
		queryFn: ({ pageParam = 1 }) =>
			getEvents({
				sort: 'this_week',
				page: pageParam,
				limit,
				isActive: false,
				isVenue: false
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1,
		select: (data) => {
			const filteredEvents = data.pages.map((page) => {
				return {
					...page,
					items: page.items.filter((event) => {
						const eventStartDateUTC = parseISO(
							`${event.startDate}T${event.startTime}Z`
						)
						return isThisISOWeek(eventStartDateUTC)
					})
				}
			})

			return { ...data, pages: filteredEvents }
		}
	})
}
