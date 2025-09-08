import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toggleHostFollow } from '@/apis/hosts/toggleHostFollow'

export function useToggleHostFollow() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: toggleHostFollow,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['host'] })
			queryClient.invalidateQueries({ queryKey: ['isFollowingHost'] })
		}
	})
}
