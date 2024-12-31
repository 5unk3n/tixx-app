import { useQuery } from '@tanstack/react-query'

import { getNotificationsUnread } from '@/apis/notifications/getNotificationsUnread'

export const useNotificationsUnread = () => {
	return useQuery({
		queryKey: ['notifications', 'unread'],
		queryFn: getNotificationsUnread,
		gcTime: 0
	})
}
