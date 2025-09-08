import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { NotificationsUnreadResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getNotificationsUnread = async () => {
	const response = await axiosInstance.get(API_PATH.NOTIFICATIONS.UNREAD)
	return validateApiResponse(response.data, NotificationsUnreadResponseSchema)
}
