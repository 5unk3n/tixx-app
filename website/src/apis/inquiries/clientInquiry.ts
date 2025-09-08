import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/lib/axiosInstance'
import { ClientInquiryFormSchema } from '@/lib/schemas/inquiries'
import { ClientInquiryForm } from '@/types'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const createClientInquiry = async (payload: ClientInquiryForm) => {
	const response = await axiosInstance.post(
		API_PATH.INQUIRIES.CLIENT_INQUIRY,
		payload
	)
	return validateApiResponse(response.data, ClientInquiryFormSchema)
}
