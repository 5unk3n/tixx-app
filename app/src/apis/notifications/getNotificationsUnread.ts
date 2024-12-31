import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { NotificationsUnreadResponseSchema } from '@/utils/schemas'

export const getNotificationsUnread = async () => {
	const response = await axiosInstance.get(API_PATH.NOTIFICATIONS.UNREAD)
	return NotificationsUnreadResponseSchema.parse(response.data)
}
