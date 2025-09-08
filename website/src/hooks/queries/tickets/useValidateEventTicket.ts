import { useMutation } from '@tanstack/react-query'

import { validateEventTicket } from '@/apis/tickets/validateEventTicket'

export const useValidateEventTicket = () => {
	return useMutation({
		mutationFn: validateEventTicket
	})
}
