import { useMutation } from '@tanstack/react-query'

import { createTicket } from '@/apis/tickets/createTicket'
import { queryClient } from '@/lib/queryClient'

export const useCreateTicket = () => {
	return useMutation({
		mutationFn: createTicket,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['ticket'] })
		}
	})
}
