import { useMutation } from '@tanstack/react-query'

import { updateReactions } from '@/apis/events/updateReactions'
import { EventReactionPayload } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useUpdateReactions = () => {
	return useMutation({
		mutationFn: ({
			eventId,
			payload
		}: {
			eventId: number
			payload: EventReactionPayload
		}) => updateReactions(eventId, payload),
		onSuccess: (_, { eventId }) => {
			queryClient.invalidateQueries({
				queryKey: ['events', eventId, 'reactions']
			})
		}
	})
}
