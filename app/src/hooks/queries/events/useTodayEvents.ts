import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { isToday, parseISO } from 'date-fns'

import { getEvents } from '@/apis/events/getEvents'

interface UseTodayEventsOptions {
	limit?: number
}

export const useTodayEvents = ({ limit = 10 }: UseTodayEventsOptions = {}) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['events', 'today', limit],
		queryFn: ({ pageParam = 1 }) =>
			getEvents({
				sort: 'today_opening',
				page: pageParam,
				limit,
				isActive: true,
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
						return isToday(eventStartDateUTC)
					})
				}
			})

			return { ...data, pages: filteredEvents }
		}
	})
}
