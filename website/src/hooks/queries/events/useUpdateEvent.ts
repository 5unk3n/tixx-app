import { useMutation } from '@tanstack/react-query'

import { updateEvent } from '@/apis/events/updateEvent'
import { queryClient } from '@/lib/queryClient'
import { CreateEventPayload } from '@/types'

export const useUpdateEvent = () => {
	return useMutation({
		mutationFn: ({
			eventId,
			payload
		}: {
			eventId: string
			payload: CreateEventPayload
		}) => updateEvent(eventId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['event'] })
		}
	})
}
