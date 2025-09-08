import { useMutation } from '@tanstack/react-query'

import { createEvent } from '@/apis/events/createEvent'
import { queryClient } from '@/lib/queryClient'

export const useCreateEvent = () => {
	return useMutation({
		mutationFn: createEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['event'] })
		}
	})
}
