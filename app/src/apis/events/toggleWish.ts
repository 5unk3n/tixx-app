import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'

export const toggleWish = async (eventId: number) => {
	await axiosInstance.patch(API_PATH.EVENTS.WISH_TOGGLE(eventId))
}
