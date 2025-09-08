import { useMutation } from '@tanstack/react-query'

import { updateHost } from '@/apis/hosts/updateHost'
import { queryClient } from '@/lib/queryClient'

export const useUpdateHost = () => {
	return useMutation({
		mutationFn: updateHost,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['host'] })
		}
	})
}
