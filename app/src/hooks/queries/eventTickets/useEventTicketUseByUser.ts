import { useMutation } from '@tanstack/react-query'

import { eventTicketUseByUser } from '@/apis/eventTickets/eventTicketUseByUser'
import { queryClient } from '@/utils/queryClient'

export const useEventTicketUseByUser = () => {
	return useMutation({
		mutationFn: eventTicketUseByUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['eventTickets'] })
		}
	})
}
