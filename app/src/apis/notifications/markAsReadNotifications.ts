import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'

export const markAsReadNotifications = async () => {
	await axiosInstance.patch(API_PATH.NOTIFICATIONS.MARK_AS_READ)
}
