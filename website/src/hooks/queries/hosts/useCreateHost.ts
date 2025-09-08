import { useMutation } from '@tanstack/react-query'

import { createHost } from '@/apis/hosts/createHost'
import { queryClient } from '@/lib/queryClient'

export const useCreateHost = () => {
	return useMutation({
		mutationFn: createHost,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['host'] })
		}
	})
}
