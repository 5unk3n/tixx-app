import { useQueries } from '@tanstack/react-query'

import { getTicketDetail } from '@/apis/tickets/getTicketDetail'

export const useTicketDetails = (ticketIds: number[]) => {
	const results = useQueries({
		queries: ticketIds.map((id) => ({
			queryKey: ['ticketDetail', id],
			queryFn: () => getTicketDetail(id),
			enabled: !!id
		}))
	})

	const data = results.map((result) => result.data)
	const isFetching = results.some((result) => result.isFetching)
	const isPending = results.some((result) => result.isPending)
	const isLoading = results.some((result) => result.isLoading)
	const isError = results.some((result) => result.isError)
	const error = results.find((result) => result.error)?.error
	const isReady = data.every((d) => d !== undefined)

	return {
		data: isReady ? data : undefined,
		isFetching,
		isPending,
		isLoading,
		isError,
		error,
		isReady,
		raw: results
	}
}
