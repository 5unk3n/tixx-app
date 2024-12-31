import { useQuery } from '@tanstack/react-query'

import { getNotifications } from '@/apis/notifications/getNotifications'

export const useNotifications = () => {
	return useQuery({
		queryKey: ['notifications'],
		queryFn: getNotifications
	})
}
