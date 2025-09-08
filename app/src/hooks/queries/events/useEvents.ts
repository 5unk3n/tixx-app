import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns'

import { getEvents } from '@/apis/events/getEvents'
import { EventFilter } from '@/types'

export const useEvents = (filter?: EventFilter) => {
	return useSuspenseInfiniteQuery({
		queryKey: ['events', filter],
		queryFn: ({ pageParam = 1 }) => getEvents({ ...filter, page: pageParam }),
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPages === lastPage.page) return undefined
			return lastPage.page + 1
		},
		initialPageParam: 1,
		select: (data) => {
			const startOfToday = startOfDay(new Date())
			const endOfToday = endOfDay(new Date())
			const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
			const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 })

			const filteredEvents = data.pages.map((page) => {
				return {
					...page,
					items: page.items.filter((event) => {
						const eventDate = new Date(event.startDate)

						if (filter?.sort === 'today_opening') {
							return eventDate >= startOfToday && eventDate <= endOfToday
						}

						if (filter?.sort === 'this_week') {
							return eventDate >= startOfThisWeek && eventDate <= endOfThisWeek
						}

						return true
					})
				}
			})
			return { ...data, pages: filteredEvents }
		}
	})
}
