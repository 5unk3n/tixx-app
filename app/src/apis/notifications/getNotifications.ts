import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { NotificationsResponseSchema } from '@/utils/schemas'

export const getNotifications = async () => {
	const response = await axiosInstance.get(API_PATH.NOTIFICATIONS.BASE)
	return NotificationsResponseSchema.parse(response.data)
}
