import { useMutation } from '@tanstack/react-query'

import { markAsReadNotifications } from '@/apis/notifications/markAsReadNotifications'

export const useMarkAsReadNotifications = () => {
	return useMutation({
		mutationFn: markAsReadNotifications
	})
}
