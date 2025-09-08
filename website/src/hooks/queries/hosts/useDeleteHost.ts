import { useMutation } from '@tanstack/react-query'

import { deleteHost } from '@/apis/hosts/deleteHost'
import { queryClient } from '@/lib/queryClient'

export const useDeleteHost = () => {
	return useMutation({
		mutationFn: deleteHost,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['host'] })
		}
	})
}
