import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'

export const deleteEventTicket = async (eventTicketId: number) => {
	await axiosInstance.delete(API_PATH.EVENT_TICKETS.BASE + `/${eventTicketId}`)
}
