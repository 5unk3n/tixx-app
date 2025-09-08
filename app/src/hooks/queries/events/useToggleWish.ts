import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toggleWish } from '@/apis/events/toggleWish'

export const useToggleWish = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (eventId: number | string) => toggleWish(Number(eventId)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] })
		}
	})
}
