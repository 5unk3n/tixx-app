import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { NotificationsResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getNotifications = async () => {
	const response = await axiosInstance.get(API_PATH.NOTIFICATIONS.BASE)
	return validateApiResponse(response.data, NotificationsResponseSchema)
}
