import { useMutation } from '@tanstack/react-query'

import { markAsReadNotifications } from '@/apis/notifications/markAsReadNotifications'
import { queryClient } from '@/utils/queryClient'

export const useMarkAsReadNotifications = () => {
	return useMutation({
		mutationFn: markAsReadNotifications,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		}
	})
}
