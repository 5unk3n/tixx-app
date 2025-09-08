import { useMutation } from '@tanstack/react-query'

import { consumeEventTicket } from '@/apis/tickets/consumeEventTicket'

export const useConsumeEventTicket = () => {
	return useMutation({
		mutationFn: consumeEventTicket
	})
}
